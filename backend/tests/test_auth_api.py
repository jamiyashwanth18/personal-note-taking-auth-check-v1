"""Auth, session, error envelope, CORS and notes-privacy integration tests (real PostgreSQL)."""

import logging
from datetime import UTC, datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import config
from app.main import app
from app.models import Session as SessionRow
from app.models import User

PW = "S3cret-pass-word!"


def register(c: TestClient, email: str = "a@example.com", password: str = PW):
    return c.post("/auth/register", json={"email": email, "password": password})


def login(c: TestClient, email: str = "a@example.com", password: str = PW):
    return c.post("/auth/login", json={"email": email, "password": password})


def token_for(c: TestClient, email: str = "a@example.com") -> str:
    assert register(c, email).status_code == 201
    r = login(c, email)
    assert r.status_code == 200
    return r.json()["token"]


def auth(t: str) -> dict:
    return {"Authorization": f"Bearer {t}"}


def test_ac033_happy_path(client: TestClient) -> None:
    r = register(client)
    assert r.status_code == 201
    assert set(r.json()) == {"id", "email"}
    r = login(client)
    assert r.status_code == 200
    body = r.json()
    assert body["token"] and body["token_type"] == "bearer"
    assert body["user"]["email"] == "a@example.com"
    me = client.get("/auth/me", headers=auth(body["token"]))
    assert me.status_code == 200 and me.json()["email"] == "a@example.com"
    out = client.post("/auth/logout", headers=auth(body["token"]))
    assert out.status_code == 204 and out.content == b""


def test_ac034_duplicate_and_invalid_input(client: TestClient) -> None:
    assert register(client).status_code == 201
    dup = register(client)
    assert dup.status_code == 409
    assert isinstance(dup.json()["detail"], str)
    assert register(client, "A@Example.com").status_code == 409
    bad_email = register(client, "not-an-email")
    assert bad_email.status_code == 422
    assert isinstance(bad_email.json()["detail"], list)
    assert register(client, "b@example.com", "short").status_code == 422


def test_ac034_login_failures_share_one_message(client: TestClient) -> None:
    register(client)
    wrong = login(client, password="wrong-password-1")
    unknown = login(client, "nobody@example.com")
    assert wrong.status_code == unknown.status_code == 401
    assert wrong.json() == unknown.json()
    assert isinstance(wrong.json()["detail"], str)


@pytest.mark.parametrize(
    "headers",
    [{}, {"Authorization": "Bearer"}, {"Authorization": "Basic abc"}, {"Authorization": "Bearer nope"}],
)
def test_ac034_missing_or_malformed_token_is_401(client: TestClient, headers: dict) -> None:
    for method, path in [("get", "/auth/me"), ("post", "/auth/logout"), ("get", "/notes")]:
        r = getattr(client, method)(path, headers=headers)
        assert r.status_code == 401
        assert isinstance(r.json()["detail"], str)


def test_ac034_unhandled_error_is_500_without_traceback() -> None:
    async def boom() -> None:
        raise RuntimeError("secret internal detail /app/secret.py")

    app.add_api_route("/__boom", boom)
    try:
        r = TestClient(app, raise_server_exceptions=False).get("/__boom")
    finally:
        app.router.routes.pop()
    assert r.status_code == 500
    assert r.json() == {"detail": "Something went wrong"}
    assert "Traceback" not in r.text and "secret" not in r.text


def test_ac010_password_is_hashed_and_never_leaked(
    client: TestClient, db_session: Session, caplog: pytest.LogCaptureFixture
) -> None:
    with caplog.at_level(logging.DEBUG):
        r1 = register(client)
        r2 = login(client)
        me = client.get("/auth/me", headers=auth(r2.json()["token"]))
    for r in (r1, r2, me):
        low = r.text.lower()
        assert PW not in r.text
        assert "password" not in low and "argon2" not in low and "hash" not in low
    user = db_session.scalar(select(User).where(User.email == "a@example.com"))
    assert user.password_hash.startswith("$argon2")
    assert user.password_hash != PW and PW not in user.password_hash
    assert PW not in caplog.text


def _age_sessions(db: Session, minutes: int) -> None:
    for s in db.scalars(select(SessionRow)):
        s.last_seen_at = datetime.now(UTC) - timedelta(minutes=minutes)
    db.commit()


def test_ac011_idle_session_expires(client: TestClient, db_session: Session) -> None:
    t = token_for(client)
    _age_sessions(db_session, config.SESSION_IDLE_TIMEOUT_MINUTES + 1)
    assert client.get("/auth/me", headers=auth(t)).status_code == 401
    assert client.get("/notes", headers=auth(t)).status_code == 401
    assert client.post("/notes", json={"title": "x", "text": ""}, headers=auth(t)).status_code == 401


def test_ac011_activity_within_window_keeps_session(
    client: TestClient, db_session: Session
) -> None:
    t = token_for(client)
    _age_sessions(db_session, config.SESSION_IDLE_TIMEOUT_MINUTES - 5)
    assert client.get("/auth/me", headers=auth(t)).status_code == 200
    assert client.get("/notes", headers=auth(t)).status_code == 200


def test_ac012_logout_revokes_token(client: TestClient) -> None:
    t = token_for(client)
    assert client.post("/auth/logout", headers=auth(t)).status_code == 204
    assert client.get("/auth/me", headers=auth(t)).status_code == 401
    assert client.get("/notes", headers=auth(t)).status_code == 401
    assert client.post("/auth/logout", headers=auth(t)).status_code == 401


def test_ac037_duplicate_email_rejected_by_database(db_session: Session) -> None:
    db_session.add(User(email="dup@example.com", password_hash="x"))
    db_session.commit()
    db_session.add(User(email="dup@example.com", password_hash="x"))
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()
    db_session.add(User(email="DUP@example.com", password_hash="x"))
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_nfr014_cors_preflight_and_no_cookie(client: TestClient) -> None:
    origin = config.ALLOWED_ORIGINS[0]
    r = client.options(
        "/auth/me",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization",
        },
    )
    assert r.status_code == 200
    assert r.headers["access-control-allow-origin"] == origin
    assert "authorization" in r.headers["access-control-allow-headers"].lower()
    assert "access-control-allow-credentials" not in r.headers
    bad = client.options(
        "/auth/me",
        headers={
            "Origin": "https://evil.example",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization",
        },
    )
    assert bad.headers.get("access-control-allow-origin") != "https://evil.example"
    register(client)
    lr = login(client)
    assert "set-cookie" not in lr.headers


def test_nfr005_notes_private_to_owner(client: TestClient) -> None:
    ta = token_for(client, "a@example.com")
    tb = token_for(client, "b@example.com")
    note = client.post("/notes", json={"title": "mine", "text": "private body"}, headers=auth(ta))
    assert note.status_code == 201
    nid = note.json()["id"]
    for r in (
        client.get(f"/notes/{nid}", headers=auth(tb)),
        client.put(f"/notes/{nid}", json={"title": "x", "text": "y"}, headers=auth(tb)),
        client.delete(f"/notes/{nid}", headers=auth(tb)),
    ):
        assert r.status_code in (403, 404)
        assert "private body" not in r.text and "mine" not in r.text
    assert client.get("/notes", headers=auth(tb)).json() == []
    assert client.get(f"/notes/{nid}", headers=auth(ta)).json()["text"] == "private body"
    assert client.get(f"/notes/{nid}").status_code == 401
    assert client.get("/notes").status_code == 401


def test_nfr007_error_responses_hide_internals(client: TestClient) -> None:
    r = client.post("/auth/register", json={"email": "a@example.com"})
    assert r.status_code == 422
    assert "Traceback" not in r.text and "sqlalchemy" not in r.text.lower()


# NFR-009 (hundreds of users) is a sizing target and cannot be meaningfully tested here.
