# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| POST | /auth/login | login | `backend/app/routers/auth.py:44` | — |
| POST | /auth/logout | logout | `backend/app/routers/auth.py:67` | — |
| GET | /auth/me | me | `backend/app/routers/auth.py:78` | — |
| POST | /auth/register | register | `backend/app/routers/auth.py:29` | — |
| GET | /health | health | `backend/app/main.py:56` | Liveness probe. |
| GET | /notes | list_notes | `backend/app/routers/notes.py:39` | — |
| POST | /notes | create_note | `backend/app/routers/notes.py:47` | — |
| DELETE | /notes/{note_id} | delete_note | `backend/app/routers/notes.py:77` | — |
| GET | /notes/{note_id} | get_note | `backend/app/routers/notes.py:56` | — |
| PUT | /notes/{note_id} | update_note | `backend/app/routers/notes.py:61` | — |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /notes/{id}
- GET /notes/{id}
- PUT /notes/{id}

**Code only:**

- DELETE /notes/{note_id}
- GET /notes/{note_id}
- PUT /notes/{note_id}
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `2bc7755`
<!-- sdlc:auto:end source -->
