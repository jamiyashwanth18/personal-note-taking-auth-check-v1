"""Request dependencies: the signed-in user, from an opaque session token."""

import hashlib
from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session as DbSession

from app import config
from app.database import get_db
from app.models import Session, User


def _unauthenticated() -> HTTPException:
    return HTTPException(
        status_code=401,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(request: Request, db: Annotated[DbSession, Depends(get_db)]) -> User:
    """Fail closed: a missing, unknown, expired, idle or revoked session is a 401."""
    scheme, _, token = request.headers.get("Authorization", "").partition(" ")
    token = token.strip()
    if scheme.lower() != "bearer" or not token:
        raise _unauthenticated()
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    session = db.scalar(select(Session).where(Session.token_hash == token_hash))
    if session is None or session.revoked_at is not None:
        raise _unauthenticated()
    now = datetime.now(UTC)
    if session.expires_at is not None and session.expires_at <= now:
        raise _unauthenticated()
    idle = timedelta(minutes=config.SESSION_IDLE_TIMEOUT_MINUTES)
    if now - session.last_seen_at > idle:
        raise _unauthenticated()
    user = db.get(User, session.user_id)
    if user is None:
        raise _unauthenticated()
    session.last_seen_at = now
    db.commit()
    return user
