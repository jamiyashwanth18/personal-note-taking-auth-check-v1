"""Application entrypoint: CORS, error shapes, and the auth and notes routers."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app import models  # noqa: F401 -- imported so the tables register before create_all
from app.config import ALLOWED_ORIGINS
from app.database import SessionLocal
from app.migrate import upgrade_to_head
from app.routers import auth, notes
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
    """Liveness probe."""
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(notes.router)


@app.exception_handler(StarletteHTTPException)
async def http_error(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    return JSONResponse({"detail": exc.detail}, status_code=exc.status_code, headers=exc.headers)


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = [
        {"field": ".".join(str(p) for p in e["loc"] if p != "body"), "message": e["msg"]}
        for e in exc.errors()
    ]
    return JSONResponse({"detail": errors}, status_code=422)


@app.exception_handler(Exception)
async def unhandled_error(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse({"detail": "Something went wrong"}, status_code=500)
