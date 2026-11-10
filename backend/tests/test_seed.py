"""Bootstrap-admin seeding: off by default, idempotent when on."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app import config
from app.models import User
from app.seed import seed_bootstrap_admin


def test_nothing_is_seeded_without_the_bootstrap_settings(db_session: Session, monkeypatch) -> None:
    monkeypatch.setattr(config, "BOOTSTRAP_ADMIN_EMAIL", "")
    monkeypatch.setattr(config, "BOOTSTRAP_ADMIN_PASSWORD", "")

    seed_bootstrap_admin(db_session)

    assert db_session.scalar(select(func.count()).select_from(User)) == 0


def test_the_admin_is_seeded_once(db_session: Session, monkeypatch) -> None:
    monkeypatch.setattr(config, "BOOTSTRAP_ADMIN_EMAIL", "Admin@Example.com")
    monkeypatch.setattr(config, "BOOTSTRAP_ADMIN_PASSWORD", "correct horse battery")

    seed_bootstrap_admin(db_session)
    seed_bootstrap_admin(db_session)

    users = db_session.scalars(select(User)).all()
    assert [u.email for u in users] == ["admin@example.com"]
    assert users[0].password_hash.startswith("$argon2id$")
