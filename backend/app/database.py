"""Engine, session factory and the request-scoped session dependency.

The approved architecture names PostgreSQL 16, so `DATABASE_URL` is a SQLAlchemy
URL for it (postgresql+psycopg://...). The platform sets it in the sandbox and when
deployed; the fallback is the local database from docker-compose.yml. The schema
changes only through Alembic migrations (see backend/migrations).
"""

import os
from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://app:app@localhost:5432/app")

# `create_engine` does not connect, so importing this module never needs a server.
engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Declarative base that every generated model inherits."""


def get_db() -> Iterator[Session]:
    """One session per request, closed even when the handler raises."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
