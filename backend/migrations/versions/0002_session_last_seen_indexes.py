"""sessions.last_seen_at, nullable expires_at, list/lookup indexes

Revision ID: 0002
Revises: 0001
Create Date: 2026-11-10
"""

import sqlalchemy as sa
from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "sessions",
        sa.Column(
            "last_seen_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    )
    with op.batch_alter_table("sessions") as batch:
        batch.alter_column("expires_at", existing_type=sa.DateTime(timezone=True), nullable=True)
    op.create_index("ix_sessions_token_hash", "sessions", ["token_hash"])
    op.create_index(
        "ix_notes_user_id_updated_at", "notes", ["user_id", sa.text("updated_at DESC")]
    )


def downgrade() -> None:
    op.drop_index("ix_notes_user_id_updated_at", "notes")
    op.drop_index("ix_sessions_token_hash", "sessions")
    with op.batch_alter_table("sessions") as batch:
        batch.alter_column("expires_at", existing_type=sa.DateTime(timezone=True), nullable=False)
        batch.drop_column("last_seen_at")
