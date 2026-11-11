"""US-007 edit a note: PUT /notes/{id} and GET /notes/{id} (real PostgreSQL)."""

from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from test_auth_api import auth, token_for
from test_notes_api import MISSING, mk


def _ts(value: str) -> datetime:
    return datetime.fromisoformat(value)


def test_ac020_put_persists_changes_and_moves_updated_at(client: TestClient) -> None:
    t = token_for(client)
    n = mk(client, t, "before", "old text")
    r = client.put(
        f"/notes/{n['id']}", json={"title": "after", "text": "new text"}, headers=auth(t)
    )
    assert r.status_code == 200
    put = r.json()
    assert (put["id"], put["title"], put["text"]) == (n["id"], "after", "new text")
    assert _ts(put["updated_at"]) > _ts(n["updated_at"])
    assert put["created_at"] == n["created_at"]
    again = client.get(f"/notes/{n['id']}", headers=auth(t)).json()
    assert (again["title"], again["text"]) == ("after", "new text")
    assert again["updated_at"] == put["updated_at"]


def test_ac020_changing_only_the_text_keeps_the_title(client: TestClient) -> None:
    t = token_for(client)
    n = mk(client, t, "same title", "a")
    r = client.put(f"/notes/{n['id']}", json={"title": "same title", "text": "b"}, headers=auth(t))
    assert r.status_code == 200
    got = client.get(f"/notes/{n['id']}", headers=auth(t)).json()
    assert (got["title"], got["text"]) == ("same title", "b")
    assert _ts(got["updated_at"]) > _ts(n["updated_at"])


def test_ac020_text_can_be_cleared_to_empty(client: TestClient) -> None:
    t = token_for(client)
    n = mk(client, t, "t", "something")
    r = client.put(f"/notes/{n['id']}", json={"title": "t", "text": ""}, headers=auth(t))
    assert r.status_code == 200
    assert client.get(f"/notes/{n['id']}", headers=auth(t)).json()["text"] == ""


@pytest.mark.parametrize(
    "payload",
    [
        {"title": "", "text": "z"},
        {"title": "   ", "text": "z"},
        {"text": "z"},
        {"title": "x" * 201, "text": "z"},
    ],
)
def test_ac021_invalid_title_is_422_and_stored_note_unchanged(
    client: TestClient, payload: dict
) -> None:
    t = token_for(client)
    n = mk(client, t, "keep", "kept text")
    r = client.put(f"/notes/{n['id']}", json=payload, headers=auth(t))
    assert r.status_code == 422
    assert "detail" in r.json()
    got = client.get(f"/notes/{n['id']}", headers=auth(t)).json()
    assert got == n


def test_put_unknown_note_is_404_with_detail(client: TestClient) -> None:
    t = token_for(client)
    r = client.put(f"/notes/{MISSING}", json={"title": "x", "text": ""}, headers=auth(t))
    assert r.status_code == 404
    assert r.json() == {"detail": "Note not found"}


def test_put_other_users_note_is_404_and_does_not_change_it(client: TestClient) -> None:
    ta = token_for(client, "a@example.com")
    tb = token_for(client, "b@example.com")
    n = mk(client, ta, "mine", "private")
    r = client.put(f"/notes/{n['id']}", json={"title": "hijack", "text": "x"}, headers=auth(tb))
    assert r.status_code == 404
    assert client.get(f"/notes/{n['id']}", headers=auth(ta)).json() == n


def test_get_note_returns_the_documented_shape(client: TestClient) -> None:
    t = token_for(client)
    n = mk(client, t, "shape", "body")
    r = client.get(f"/notes/{n['id']}", headers=auth(t))
    assert r.status_code == 200
    assert set(r.json()) == {"id", "title", "text", "created_at", "updated_at"}
    assert client.get(f"/notes/{MISSING}", headers=auth(t)).json() == {"detail": "Note not found"}
