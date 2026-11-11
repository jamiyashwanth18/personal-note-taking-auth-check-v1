"""US-010 / AC-029: no sharing, tags, search or rich text in the API (real PostgreSQL)."""

import re

from fastapi.testclient import TestClient
from test_auth_api import auth, token_for
from test_notes_api import MISSING, mk

from app.main import app

FORBIDDEN = re.compile(r"shar|collab|tag|search|format|rich|html|markdown|invite", re.I)


def test_ac029_openapi_declares_only_the_approved_routes() -> None:
    paths = app.openapi()["paths"]
    notes_paths = {p for p in paths if p.startswith("/notes")}
    assert notes_paths == {"/notes", "/notes/{note_id}"}
    assert {m for m in paths["/notes"]} == {"get", "post"}
    assert {m for m in paths["/notes/{note_id}"]} == {"get", "put", "delete"}
    for path in paths:
        assert not FORBIDDEN.search(path), path


def test_ac029_note_schemas_have_no_sharing_tag_or_format_fields() -> None:
    schemas = app.openapi()["components"]["schemas"]
    for name in ("NoteIn", "NoteOut"):
        assert set(schemas[name]["properties"]) <= {
            "id",
            "title",
            "text",
            "created_at",
            "updated_at",
        }, name


def test_ac029_sharing_and_search_urls_do_not_exist(client: TestClient) -> None:
    t = token_for(client)
    note = mk(client, t, "mine", "text")
    nid = note["id"]
    urls = [
        ("get", "/notes/search"),
        ("get", "/search"),
        ("get", "/tags"),
        ("get", "/shared"),
        ("post", f"/notes/{nid}/share"),
        ("get", f"/notes/{nid}/share"),
        ("post", f"/notes/{nid}/tags"),
        ("get", f"/notes/{nid}/tags"),
        ("post", f"/notes/{nid}/collaborators"),
    ]
    for method, url in urls:
        r = getattr(client, method)(url, headers=auth(t))
        assert r.status_code in (404, 405, 422), (method, url, r.status_code)
    # the note is untouched
    assert client.get(f"/notes/{nid}", headers=auth(t)).json()["title"] == "mine"


def test_ac029_search_query_does_not_filter_the_list(client: TestClient) -> None:
    t = token_for(client)
    mk(client, t, "apple pie", "fruit")
    mk(client, t, "carburettor", "engine")
    for q in ("q", "search", "query", "tag", "title"):
        r = client.get("/notes", params={q: "apple"}, headers=auth(t))
        assert r.status_code == 200
        assert {n["title"] for n in r.json()} == {"apple pie", "carburettor"}, q


def test_ac029_tag_and_share_fields_are_not_stored_or_returned(client: TestClient) -> None:
    ta = token_for(client, "a@example.com")
    tb = token_for(client, "b@example.com")
    payload = {
        "title": "t",
        "text": "plain",
        "tags": ["x"],
        "shared": True,
        "shared_with": ["b@example.com"],
        "format": "markdown",
        "html": "<b>x</b>",
    }
    created = client.post("/notes", json=payload, headers=auth(ta))
    assert created.status_code == 201
    assert set(created.json()) == {"id", "title", "text", "created_at", "updated_at"}
    nid = created.json()["id"]
    upd = client.put(f"/notes/{nid}", json={**payload, "title": "t2"}, headers=auth(ta))
    assert upd.status_code == 200
    assert set(upd.json()) == {"id", "title", "text", "created_at", "updated_at"}
    # Sharing flag had no effect: B cannot see or list A's note.
    assert client.get(f"/notes/{nid}", headers=auth(tb)).status_code == 404
    assert client.get("/notes", headers=auth(tb)).json() == []
    assert client.get(f"/notes/{MISSING}", headers=auth(tb)).status_code == 404


def test_ac029_text_is_stored_verbatim_as_plain_text(client: TestClient) -> None:
    t = token_for(client)
    raw = "# heading\n**bold** <b>x</b> <script>alert(1)</script>\n- item"
    note = mk(client, t, "plain", raw)
    assert note["text"] == raw
    assert client.get(f"/notes/{note['id']}", headers=auth(t)).json()["text"] == raw
