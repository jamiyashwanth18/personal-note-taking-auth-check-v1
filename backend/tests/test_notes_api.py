"""Notes API: ordering, create, plain-text storage, validation and privacy (real PostgreSQL)."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from test_auth_api import auth, token_for

from app.models import Note

MISSING = "00000000-0000-0000-0000-0000000000aa"


def mk(c: TestClient, t: str, title: str, text: str = ""):
    r = c.post("/notes", json={"title": title, "text": text}, headers=auth(t))
    assert r.status_code == 201
    return r.json()


def test_ac013_list_only_own_notes_ordered_updated_desc(client: TestClient) -> None:
    ta = token_for(client, "a@example.com")
    tb = token_for(client, "b@example.com")
    n1 = mk(client, ta, "one")
    n2 = mk(client, ta, "two")
    n3 = mk(client, ta, "three")
    mk(client, tb, "other")
    r = client.get("/notes", headers=auth(ta))
    assert r.status_code == 200
    body = r.json()
    assert [n["id"] for n in body] == [n3["id"], n2["id"], n1["id"]]
    assert all({"id", "title", "text", "created_at", "updated_at"} == set(n) for n in body)
    stamps = [n["updated_at"] for n in body]
    assert stamps == sorted(stamps, reverse=True)


def test_ac014_put_on_oldest_moves_it_first(client: TestClient) -> None:
    t = token_for(client)
    oldest = mk(client, t, "old")
    mk(client, t, "mid")
    mk(client, t, "new")
    r = client.put(f"/notes/{oldest['id']}", json={"title": "old2", "text": "x"}, headers=auth(t))
    assert r.status_code == 200
    body = client.get("/notes", headers=auth(t)).json()
    assert body[0]["id"] == oldest["id"] and body[0]["title"] == "old2"
    assert len(body) == 3


def test_ac015_no_notes_is_empty_list(client: TestClient) -> None:
    t = token_for(client)
    r = client.get("/notes", headers=auth(t))
    assert r.status_code == 200 and r.json() == []


def test_ac017_create_returns_201_and_appears_first(client: TestClient) -> None:
    t = token_for(client)
    mk(client, t, "earlier")
    r = client.post("/notes", json={"title": "T", "text": "body"}, headers=auth(t))
    assert r.status_code == 201
    out = r.json()
    assert out["title"] == "T" and out["text"] == "body" and out["id"]
    assert client.get("/notes", headers=auth(t)).json()[0]["id"] == out["id"]
    assert client.get(f"/notes/{out['id']}", headers=auth(t)).json()["text"] == "body"


@pytest.mark.parametrize("title", ["", "   ", "\t\n"])
def test_ac018_blank_title_is_422_and_stores_nothing(
    client: TestClient, db_session: Session, title: str
) -> None:
    t = token_for(client)
    r = client.post("/notes", json={"title": title, "text": "body"}, headers=auth(t))
    assert r.status_code == 422
    assert db_session.scalar(select(func.count()).select_from(Note)) == 0
    assert client.get("/notes", headers=auth(t)).json() == []


def test_ac018_blank_title_on_put_is_422_and_note_unchanged(client: TestClient) -> None:
    t = token_for(client)
    n = mk(client, t, "keep", "text")
    r = client.put(f"/notes/{n['id']}", json={"title": " ", "text": "z"}, headers=auth(t))
    assert r.status_code == 422
    got = client.get(f"/notes/{n['id']}", headers=auth(t)).json()
    assert got["title"] == "keep" and got["text"] == "text"


def test_ac019_nfr006_html_stored_and_returned_unchanged(client: TestClient) -> None:
    t = token_for(client)
    title = '<script>alert(1)</script><b>t</b> & "q"'
    text = "<img src=x onerror=alert(1)>\n<script>x</script> &amp; <div>é</div>"
    n = mk(client, t, title, text)
    assert (n["title"], n["text"]) == (title, text)
    got = client.get(f"/notes/{n['id']}", headers=auth(t)).json()
    assert (got["title"], got["text"]) == (title, text)
    listed = client.get("/notes", headers=auth(t)).json()[0]
    assert (listed["title"], listed["text"]) == (title, text)
    up = client.put(f"/notes/{n['id']}", json={"title": title, "text": text}, headers=auth(t))
    assert (up.json()["title"], up.json()["text"]) == (title, text)


def test_nfr005_other_users_note_is_404_identical_to_missing(client: TestClient) -> None:
    ta = token_for(client, "a@example.com")
    tb = token_for(client, "b@example.com")
    nid = mk(client, ta, "secret-title", "secret-body")["id"]
    payload = {"title": "x", "text": "y"}
    for method, kw in [("get", {}), ("put", {"json": payload}), ("delete", {})]:
        other = getattr(client, method)(f"/notes/{nid}", headers=auth(tb), **kw)
        missing = getattr(client, method)(f"/notes/{MISSING}", headers=auth(tb), **kw)
        assert other.status_code == missing.status_code == 404
        assert other.content == missing.content
        assert "secret" not in other.text
    assert client.get("/notes", headers=auth(tb)).json() == []
    mine = client.get(f"/notes/{nid}", headers=auth(ta)).json()
    assert mine["title"] == "secret-title" and mine["text"] == "secret-body"


def test_nfr005_all_notes_routes_require_token(client: TestClient) -> None:
    p = {"title": "x", "text": ""}
    calls = [
        client.get("/notes"),
        client.post("/notes", json=p),
        client.get(f"/notes/{MISSING}"),
        client.put(f"/notes/{MISSING}", json=p),
        client.delete(f"/notes/{MISSING}"),
    ]
    assert [r.status_code for r in calls] == [401] * 5


def test_nfr005_delete_own_note_204_then_404(client: TestClient) -> None:
    t = token_for(client)
    n = mk(client, t, "gone")
    assert client.delete(f"/notes/{n['id']}", headers=auth(t)).status_code == 204
    assert client.get(f"/notes/{n['id']}", headers=auth(t)).status_code == 404
    assert client.get("/notes", headers=auth(t)).json() == []


# NFR-009 (hundreds of users) is a sizing target; not testable meaningfully here.
