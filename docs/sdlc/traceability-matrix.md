# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Register from the Login screen | US-001 | 2 | POST /auth/register, auth_service, sessions, users, web_spa | backend/tests/test_auth_api.py, frontend/src/App.tsx, frontend/src/lib/api.ts, frontend/src/lib/auth.tsx, frontend/src/screens/Login.test.tsx +3 more | ac66d94 | delivered | succeeded | 2/4 tested · 2/4 passing | — |
| US-002 | EPIC-001 | Sign in with email and password | US-002 | 2 | GET /auth/me, POST /auth/login, auth_service, sessions, users, web_spa | — | ac66d94 | delivered | not run | 1/3 tested · 1/3 passing | — |
| US-003 | EPIC-001 | Sign out | US-003 | 2 | POST /auth/logout, auth_service, sessions, web_spa | — | ac66d94 | delivered | not run | 0/2 tested · 0/2 passing | — |
| US-004 | EPIC-001 | Session and password security | US-004 | 1 | auth_service, database, sessions, users | — | 7f593a4 | delivered | not run | 3/3 tested · 3/3 passing | bc6fa51ff85f |
| US-005 | EPIC-002 | View my notes list | US-005 | 2 | GET /notes, notes, web_spa | backend/tests/test_notes_api.py, frontend/src/App.tsx, frontend/src/screens/NoteEditor.tsx, frontend/src/screens/Notes.test.tsx, frontend/src/screens/Notes.tsx | 9abe997 | delivered | succeeded | 3/4 tested · 3/4 passing | — |
| US-006 | EPIC-002 | Create a note | US-006 | 2 | POST /notes, notes, web_spa | — | 9abe997 | delivered | not run | 3/3 tested · 3/3 passing | — |
| US-007 | EPIC-002 | Edit a note | US-007 | 3 | GET /notes/{id}, PUT /notes/{id}, notes, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-008 | EPIC-002 | Delete a note with confirmation | US-008 | 3 | DELETE /notes/{id}, notes, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-009 | EPIC-003 | Notes are visible only to their owner | US-009 | 3 | DELETE /notes/{id}, GET /notes, GET /notes/{id}, PUT /notes/{id}, api, notes, notes_service, users | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-010 | EPIC-003 | No sharing or discovery features | US-010 | 3 | api, web_spa | — | — | not started | not run | 0/1 tested · 0/1 passing | — |
| US-011 | EPIC-004 | Use the app on phone and desktop | US-011 | 3 | web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-012 | EPIC-005 | Accounts and notes API | US-012, US-012-T1, US-012-T2, US-012-T3 | 1 | DELETE /notes/{id}, GET /health, GET /notes, GET /notes/{id}, POST /notes, PUT /notes/{id}, api, auth_service, notes, notes_service, sessions, users | backend/app/config.py, backend/app/deps.py, backend/app/main.py, backend/app/models.py, backend/app/routers/auth.py +5 more | 7f593a4 | delivered | succeeded | 2/3 tested · 2/3 passing | bc6fa51ff85f |
| US-013 | EPIC-005 | Persist users and notes in PostgreSQL | US-013 | 1 | database, notes, sessions, users | — | 7f593a4 | delivered | not run | 1/3 tested · 1/3 passing | bc6fa51ff85f |
| US-014 | EPIC-005 | No external services needed | US-014 | 1 | api, database | — | 7f593a4 | delivered | not run | 0/1 tested · 0/1 passing | bc6fa51ff85f |
| US-015 | EPIC-006 | Basic setup and usage guide | US-015 | 3 | — | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
<!-- sdlc:auto:end matrix -->
