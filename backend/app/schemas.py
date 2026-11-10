"""Pydantic request and response models."""

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


class StubResponse(BaseModel):
    """Placeholder body for a route that is not implemented yet."""

    endpoint: str
    status: str = "not_implemented"
    detail: str = "Scaffolded from the approved API spec; no behaviour yet."


class UserOut(BaseModel):
    id: uuid.UUID
    email: str


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=256)


class LoginIn(BaseModel):
    email: str
    password: str = Field(max_length=256)


class LoginOut(BaseModel):
    token: str
    token_type: str = "bearer"
    user: UserOut


class NoteOut(BaseModel):
    id: uuid.UUID
    title: str
    text: str
    created_at: datetime
    updated_at: datetime


class NoteIn(BaseModel):
    title: str = Field(max_length=200)
    text: str = ""

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title must not be empty")
        return v


class FieldError(BaseModel):
    field: str
    message: str


class ErrorResponse(BaseModel):
    """{detail: message} for HTTP errors; validation errors carry a list of FieldError."""

    detail: str | list[FieldError]
