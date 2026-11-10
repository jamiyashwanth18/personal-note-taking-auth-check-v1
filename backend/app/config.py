"""Settings read from the environment, each with a working local default.

The platform sets these on the deployed container. Nothing here is a secret
default worth keeping: the local values only exist so tests and `uvicorn` run.
"""

import os

_DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]


def _split(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


# The SPA's origin(s) for CORS, comma separated.
ALLOWED_ORIGINS: list[str] = (
    _split(os.getenv("CORS_ALLOWED_ORIGINS") or os.getenv("ALLOWED_ORIGINS", "")) or _DEV_ORIGINS
)

# The shared API bearer the generated frontend sends. Public: never sign anything with it.
SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-shared-api-key")

# Private. Signs tokens and sessions.
JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-only-jwt-secret-change-me")

# First admin, set by the platform on the deployed API only. Unset locally and in tests:
# seed nothing then.
BOOTSTRAP_ADMIN_EMAIL: str = os.getenv("BOOTSTRAP_ADMIN_EMAIL", "")
BOOTSTRAP_ADMIN_PASSWORD: str = os.getenv("BOOTSTRAP_ADMIN_PASSWORD", "")

# Minutes of inactivity before a session ends.
SESSION_IDLE_TIMEOUT_MINUTES: int = int(os.getenv("SESSION_IDLE_TIMEOUT_MINUTES", "30"))
