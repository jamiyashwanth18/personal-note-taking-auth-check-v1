"""Notes endpoints, private to their owner."""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import func, select
from sqlalchemy.orm import Session as DbSession

from app.database import get_db
from app.deps import get_current_user
from app.models import Note, User
from app.schemas import NoteIn, NoteOut

CurrentUser = Annotated[User, Depends(get_current_user)]
Db = Annotated[DbSession, Depends(get_db)]

router = APIRouter(prefix="/notes", tags=["notes"])


def _out(n: Note) -> NoteOut:
    return NoteOut(
        id=n.id, title=n.title, text=n.body, created_at=n.created_at, updated_at=n.updated_at
    )


def _owned(db: DbSession, user: User, note_id: str) -> Note:
    """Missing, malformed and not-owned ids are indistinguishable."""
    try:
        nid = uuid.UUID(note_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Note not found") from None
    note = db.scalar(select(Note).where(Note.id == nid, Note.user_id == user.id))
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.get("", response_model=list[NoteOut])
def list_notes(user: CurrentUser, db: Db) -> list[NoteOut]:
    rows = db.scalars(
        select(Note).where(Note.user_id == user.id).order_by(Note.updated_at.desc(), Note.id)
    )
    return [_out(n) for n in rows]


@router.post("", response_model=NoteOut, status_code=201)
def create_note(body: NoteIn, user: CurrentUser, db: Db) -> NoteOut:
    note = Note(user_id=user.id, title=body.title, body=body.text)
    db.add(note)
    db.commit()
    db.refresh(note)
    return _out(note)


@router.get("/{note_id}", response_model=NoteOut)
def get_note(note_id: str, user: CurrentUser, db: Db) -> NoteOut:
    return _out(_owned(db, user, note_id))


@router.put("/{note_id}", response_model=NoteOut)
def update_note(
    note_id: str,
    body: NoteIn,
    user: CurrentUser,
    db: Db,
) -> NoteOut:
    note = _owned(db, user, note_id)
    note.title = body.title
    note.body = body.text
    note.updated_at = func.clock_timestamp()
    db.commit()
    db.refresh(note)
    return _out(note)


@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: str, user: CurrentUser, db: Db) -> Response:
    db.delete(_owned(db, user, note_id))
    db.commit()
    return Response(status_code=204)
