"""Application entrypoint.

Generated from the approved architecture: one router per component that owns
endpoints, one route per endpoint the API spec declares. Every generated route
is a stub that returns a typed placeholder, so the service starts, serves its
OpenAPI document and passes its tests before a single handler is implemented.
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 -- imported so the tables register before create_all
from app.config import ALLOWED_ORIGINS
from app.database import SessionLocal
from app.migrate import upgrade_to_head
from app.seed import seed_bootstrap_admin


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Bring the schema up to date with the Alembic migrations, then serve.

    This runs on startup and not at import, so importing the application never opens a
    connection and a test can point `get_db` at its own session.
    """
    upgrade_to_head()
    with SessionLocal() as db:
        seed_bootstrap_admin(db)
    yield


app = FastAPI(
    title="Personal note taking - auth check v1",
    description="A simple personal notes app: sign in, then create, edit and delete your notes.",
    version="0.1.0",
    lifespan=lifespan,
)

# The SPA runs on a different origin than the API, so the browser refuses its calls
# unless that origin is allowed here. In development that is the Vite dev server; when
# deployed, the platform injects the frontend's real URL as ALLOWED_ORIGINS (comma
# separated). Point ALLOWED_ORIGINS at the real thing and nothing else has to change.
#
# Sessions travel as an `Authorization: Bearer` header, never a cookie, so credentials
# stay off.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok"}
