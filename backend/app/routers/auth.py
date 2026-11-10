"""Auth endpoints: register, login, logout, me. Opaque Bearer sessions, no cookies."""

import hashlib
import secrets
from datetime import UTC, datetime
from typing import Annotated

from argon2 import PasswordHasher
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session as DbSession

from app.database import get_db
from app.deps import get_current_user
from app.models import Session, User
from app.schemas import LoginIn, LoginOut, RegisterIn, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

_hasher = PasswordHasher()
# Verified against when the email is unknown, so timing does not reveal existence.
_DUMMY_HASH = _hasher.hash("not-a-real-password")

Db = Annotated[DbSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/register", response_model=UserOut, status_code=201)
def register(body: RegisterIn, db: Db) -> UserOut:
    email = body.email.strip().lower()
    if db.scalar(select(User.id).where(User.email == email)) is not None:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(email=email, password_hash=_hasher.hash(body.password))
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already registered") from None
    return UserOut(id=user.id, email=user.email)


@router.post("/login", response_model=LoginOut)
def login(body: LoginIn, db: Db) -> LoginOut:
    email = body.email.strip().lower()
    user = db.scalar(select(User).where(User.email == email))
    stored = user.password_hash if user else _DUMMY_HASH
    try:
        ok = _hasher.verify(stored, body.password)
    except Exception:
        ok = False
    if user is None or not ok:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = secrets.token_urlsafe(32)
    db.add(
        Session(
            user_id=user.id,
            token_hash=hashlib.sha256(token.encode()).hexdigest(),
            last_seen_at=datetime.now(UTC),
        )
    )
    db.commit()
    return LoginOut(token=token, user=UserOut(id=user.id, email=user.email))


@router.post("/logout", status_code=204)
def logout(request: Request, user: CurrentUser, db: Db) -> Response:
    token = request.headers.get("authorization", "").partition(" ")[2].strip()
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    session = db.scalar(select(Session).where(Session.token_hash == token_hash))
    if session is not None:
        session.revoked_at = datetime.now(UTC)
        db.commit()
    return Response(status_code=204)


@router.get("/me", response_model=UserOut)
def me(user: CurrentUser) -> UserOut:
    return UserOut(id=user.id, email=user.email)
