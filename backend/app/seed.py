"""First-admin seeding, run on startup.

The platform sets BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD on the deployed
API. With either unset (local runs, tests) nothing is seeded. Idempotent: the user is
created only when no user with that email exists. The app has no roles, so there is
no role to assign.
"""

from argon2 import PasswordHasher
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import config
from app.models import User


def seed_bootstrap_admin(db: Session) -> None:
    email = config.BOOTSTRAP_ADMIN_EMAIL.strip().lower()
    password = config.BOOTSTRAP_ADMIN_PASSWORD
    if not email or not password:
        return
    if db.scalar(select(User.id).where(User.email == email)) is not None:
        return
    db.add(User(email=email, password_hash=PasswordHasher().hash(password)))
    db.commit()
