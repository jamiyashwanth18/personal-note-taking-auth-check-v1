"""Test fixtures: the real PostgreSQL the sandbox runs (`DATABASE_URL`), migrated once.

The schema is built by the Alembic migrations, exactly as in production. Every test
starts with empty tables: they are truncated after each test.
"""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import NullPool

from app import models  # noqa: F401 -- registers the tables on Base.metadata
from app.database import DATABASE_URL, Base, get_db
from app.main import app
from app.migrate import upgrade_to_head


@pytest.fixture(scope="session")
def engine() -> Iterator[Engine]:
    eng = create_engine(DATABASE_URL, poolclass=NullPool, future=True)
    upgrade_to_head(eng)
    yield eng
    eng.dispose()


@pytest.fixture
def db_session(engine: Engine) -> Iterator[Session]:
    """A session on the migrated database; every table is emptied afterwards."""
    session = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)()
    try:
        yield session
    finally:
        session.close()
        with engine.begin() as conn:
            for table in reversed(Base.metadata.sorted_tables):
                conn.execute(table.delete())


@pytest.fixture
def client(db_session: Session) -> Iterator[TestClient]:
    """The application, talking to this test's session and nothing else."""

    def _get_db() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = _get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
