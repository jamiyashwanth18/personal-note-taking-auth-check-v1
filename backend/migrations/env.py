"""Alembic environment: online migrations against DATABASE_URL."""

import sys
from pathlib import Path

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Engine, create_engine

# The alembic CLI does not put backend/ on sys.path; `import app` needs it.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app import models  # noqa: E402, F401 -- registers the tables on Base.metadata
from app.database import DATABASE_URL, Base  # noqa: E402

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(url=DATABASE_URL, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    # A caller (app startup, tests) may hand in an engine through the config attributes.
    engine: Engine | None = context.config.attributes.get("engine")
    if engine is None:
        engine = create_engine(DATABASE_URL, poolclass=pool.NullPool)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
