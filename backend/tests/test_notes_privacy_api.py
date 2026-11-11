"""US-009 privacy: AC-026, AC-027 and AC-028 beyond the basic cases (real PostgreSQL)."""

import pytest
from fastapi.testclient import TestClient
from test_auth_api import auth, token_for
from test_notes_api import MISSING, mk

NOTES_CALLS = [
    ("get", "/notes", {}),
    ("post", "/notes", {"json": {"title": "x", "text": "y"}}),
    ("get", f"/notes/{MISSING}", {}),
    ("put", f"/notes/{MISSING}", {"json": {"title": "x", "text": "y"}}),
    ("delete", f"/notes/{MISSING}", {}),
]


def test_ac026_each_user_lists_exactly_their_own_notes(client: TestClient) -> None:
    ta = token_for(client, "a@example.com")
    tb = token_for(client, "b@example.com")
    a1 = mk(client, ta, "a-one", "a-body-1")
    a2 = mk(client, ta, "a-two", "a-body-2")
    b1 = mk(client, tb, "b-one", "b-body-1")
    list_a = client.get("/notes", headers=auth(ta)).json()
    list_b = client.get("/notes", headers=auth(tb)).json()
    assert {n["id"] for n in list_a} == {a1["id"], a2["id"]}
    assert {n["id"] for n in list_b} == {b1["id"]}
    assert "b-one" not in str(list_a) and "a-one" not in str(list_b)


def test_ac027_other_users_attempts_leave_note_and_list_unchanged(client: TestClient) -> None:
    ta = token_for(client, "a@example.com")
    tb = token_for(client, "b@example.com")
    note = mk(client, ta, "private-title", "private-body")
    before = client.get(f"/notes/{note['id']}", headers=auth(ta)).json()

    payload = {"title": "hijacked", "text": "hijacked"}
    assert client.put(f"/notes/{note['id']}", json=payload, headers=auth(tb)).status_code == 404
    assert client.delete(f"/notes/{note['id']}", headers=auth(tb)).status_code == 404

    assert client.get(f"/notes/{note['id']}", headers=auth(ta)).json() == before
    assert [n["id"] for n in client.get("/notes", headers=auth(ta)).json()] == [note["id"]]


def test_ac027_refusal_body_reveals_nothing(client: TestClient) -> None:
    ta = token_for(client, "a@example.com")
    tb = token_for(client, "b@example.com")
    note = mk(client, ta, "private-title", "private-body")
    r = client.get(f"/notes/{note['id']}", headers=auth(tb))
    assert r.status_code == 404
    assert r.json() == {"detail": "Note not found"}
    assert "private" not in r.text and ta not in r.text


@pytest.mark.parametrize(("method", "path", "kw"), NOTES_CALLS)
def test_ac028_garbage_token_is_401_on_every_notes_endpoint(
    client: TestClient, method: str, path: str, kw: dict
) -> None:
    r = getattr(client, method)(path, headers=auth("not-a-real-token"), **kw)
    assert r.status_code == 401


@pytest.mark.parametrize(("method", "path", "kw"), NOTES_CALLS)
def test_ac028_non_bearer_header_is_401_on_every_notes_endpoint(
    client: TestClient, method: str, path: str, kw: dict
) -> None:
    t = token_for(client)
    r = getattr(client, method)(path, headers={"Authorization": f"Basic {t}"}, **kw)
    assert r.status_code == 401


def test_ac028_signed_out_token_is_rejected_and_reveals_no_notes(client: TestClient) -> None:
    t = token_for(client)
    note = mk(client, t, "mine", "secret-body")
    assert client.post("/auth/logout", headers=auth(t)).status_code == 204
    for method, path, kw in [
        ("get", "/notes", {}),
        ("get", f"/notes/{note['id']}", {}),
        ("put", f"/notes/{note['id']}", {"json": {"title": "x", "text": "y"}}),
        ("delete", f"/notes/{note['id']}", {}),
    ]:
        r = getattr(client, method)(path, headers=auth(t), **kw)
        assert r.status_code == 401
        assert "secret-body" not in r.text
    # The note survives the rejected delete.
    t2 = client.post(
        "/auth/login", json={"email": "a@example.com", "password": "S3cret-pass-word!"}
    ).json()["token"]
    assert client.get(f"/notes/{note['id']}", headers=auth(t2)).status_code == 200
