# Test Report

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start e2e -->
**Status:** passed
**Target:** sandbox
**Date:** 2026-11-11

Passed: 41 · Failed: 0 · Skipped: 0 · Flaky: 0 · Total: 41

| Spec | Status |
|---|---|
| [AC-023] choosing Delete shows a confirmation and the note still exists | passed |
| [AC-024] confirming deletes the note; it is gone from the list, also after reload | passed |
| [AC-025] cancelling keeps the note unchanged | passed |
| [AC-020] user edits title and text, saves, and reopening shows the new content | passed |
| [AC-021] clearing the title blocks saving with a message and the stored note is unchanged | passed |
| [AC-022] a failed save shows an error and the entered text stays in the editor | passed |
| [AC-020] PUT /notes/{id} returns 200 with the updated note and a later updated_at | passed |
| [AC-021] PUT with an empty, blank or missing title is 422 and leaves the note unchanged | passed |
| [AC-020] GET and PUT on another user's or a missing note are 404 'Note not found' | passed |
| [AC-020] GET and PUT /notes/{id} without a token are 401 | passed |
| the app loads | passed |
| [AC-029] Login screen has no share, tag, search or formatting controls | passed |
| [AC-029] the note text field is a plain textarea and there is no toolbar | passed |
| [AC-029] OpenAPI lists no share, tag or search routes and GET /notes has no filter parameter | passed |
| [AC-029] q and tag query parameters do not change the GET /notes result | passed |
| [AC-029] HTML typed into a note is stored and shown as plain text, not rendered | passed |
| [AC-029] Notes list offers no share, tag or search controls | passed |
| [AC-029] Note editor is a plain title and text form with no sharing, tag or format controls | passed |
| [AC-029] formatting characters are saved and shown as plain text | passed |
| [AC-029] API exposes no share, tag, search or collaborator endpoints | passed |
| [AC-029] list ignores search parameters and notes carry no tag or share fields | passed |
| [AC-028] invalid and revoked tokens get 401 on every notes endpoint | passed |
| [NFR-005] refusal of another user's note uses the {detail} shape without content | passed |
| [AC-026] A's Notes list shows only A's notes | passed |
| [AC-026] the list API returns only the caller's notes | passed |
| [AC-027] B opening A's note by URL sees not-found and none of its content | passed |
| [AC-027] B's GET, PUT and DELETE on A's note are refused as 404 and change nothing | passed |
| [AC-028] every notes endpoint rejects a request without sign-in as 401 | passed |
| [AC-028] a signed-out visitor opening the notes screen is sent to sign-in | passed |
| [AC-028] after signing out, the old token is rejected by the API | passed |
| [AC-030] Login: no horizontal scroll, sign in and sign up controls usable | passed |
| [AC-030][NFR-013] Notes list with several notes and a long title | passed |
| [AC-030][NFR-013] Note editor: Save, Close, Delete, Sign out usable | passed |
| [AC-031][NFR-013] Login is readable and not stretched | passed |
| [AC-031] Notes list and editor stay within a sensible width | passed |
| [AC-032] unknown URLs redirect to Login at 360px | passed |
| [AC-032] Login offers sign-up, signed-in screens are Notes list and editor at 360px | passed |
| [AC-032] unknown URLs redirect to Login at 1280px | passed |
| [AC-032] Login offers sign-up, signed-in screens are Notes list and editor at 1280px | passed |
| [AC-040] a fresh visitor of the running app reaches the Login screen | passed |
| [AC-040] the backend the guide starts answers its health check | passed |
<!-- sdlc:auto:end e2e -->

<!-- sdlc:auto:start unit -->
**Coverage:** backend 95.0% · frontend 72.8%

**Test cases:** 0 / 76 written

**Lines written:** 0

**Files deferred:** 0
<!-- sdlc:auto:end unit -->

<!-- sdlc:auto:start dev-checks -->
### Sprint 3

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | failed | — | 2026-11-11 |
| write_tests | succeeded | US-007 | 2026-11-11 |
| write_tests | succeeded | US-009 | 2026-11-11 |
| write_tests | succeeded | US-010 | 2026-11-11 |
| write_tests | succeeded | US-011 | 2026-11-11 |

### Sprint 2

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-10 |
| write_tests | succeeded | US-001 | 2026-11-10 |
| write_tests | succeeded | US-005 | 2026-11-10 |

### Sprint 1

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-10 |
| write_tests | succeeded | US-012 | 2026-11-10 |
<!-- sdlc:auto:end dev-checks -->
