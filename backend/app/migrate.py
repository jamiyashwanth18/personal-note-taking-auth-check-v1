"""Run the Alembic migrations from code (application startup, tests)."""

from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy.engine import Engine

_BACKEND = Path(__file__).resolve().parent.parent


def upgrade_to_head(engine: Engine | None = None) -> None:
    cfg = Config(str(_BACKEND / "alembic.ini"))
    # Absolute, so it works whatever directory uvicorn or pytest was started from.
    cfg.set_main_option("script_location", str(_BACKEND / "migrations"))
    if engine is not None:
        cfg.attributes["engine"] = engine
    command.upgrade(cfg, "head")
