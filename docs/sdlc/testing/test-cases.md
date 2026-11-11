# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
147 tests · Passed 94 · Failed 17 · Skipped 0 · Not run 36

Acceptance criteria covered: 32/41 · passing: 18/41
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-012: Accounts and notes API

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-002 | test_ac002_case_variant_duplicate_leaves_one_row | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-003 | test_ac003_invalid_registration_is_422_and_creates_no_user[payload0-email] | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-003 | test_ac003_invalid_registration_is_422_and_creates_no_user[payload1-password] | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-003 | test_ac003_invalid_registration_is_422_and_creates_no_user[payload2-password] | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-003 | test_ac003_invalid_registration_is_422_and_creates_no_user[payload3-email] | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-007 | test_ac007_notes_require_token | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-010 | test_ac010_password_is_hashed_and_never_leaked | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-011 | test_ac011_activity_within_window_keeps_session | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-011 | test_ac011_idle_session_expires | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-012 | test_ac012_logout_revokes_token | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-033 | test_ac033_happy_path | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_duplicate_and_invalid_input | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_login_failures_share_one_message | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_missing_or_malformed_token_is_401[headers0] | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_missing_or_malformed_token_is_401[headers1] | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_missing_or_malformed_token_is_401[headers2] | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_missing_or_malformed_token_is_401[headers3] | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_unhandled_error_is_500_without_traceback | Integration | Passed | `backend/tests/test_auth_api.py` |
| AC-037 | test_ac037_duplicate_email_rejected_by_database | Integration | Passed | `backend/tests/test_auth_api.py` |
| — | test_nfr005_notes_private_to_owner | Integration | Passed | `backend/tests/test_auth_api.py` |
| — | test_nfr007_error_responses_hide_internals | Integration | Passed | `backend/tests/test_auth_api.py` |
| — | test_nfr011_note_without_user_id_rejected_by_database | Integration | Passed | `backend/tests/test_auth_api.py` |
| — | test_nfr014_cors_preflight_and_no_cookie | Integration | Passed | `backend/tests/test_auth_api.py` |

## Sprint 2

### US-001: Register from the Login screen

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-002 | Login > [AC-002] shows a message on 409 | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-003 | Login > [AC-003] validates before sending a register request | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-005 | Login > [AC-005] signs in and lands on /notes | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-006 | Login > [AC-006] shows one generic message on 401 | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-007 | Login > [AC-007] redirects to /login when not signed in | Unit | Passed | `frontend/src/screens/Login.test.tsx` |

### US-005: View my notes list

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-013, AC-019 | Notes > [AC-013] lists titles in returned order and [AC-019] shows tags literally | Unit | Passed | `frontend/src/screens/Notes.test.tsx` |
| AC-013 | Notes > [AC-013] shows an error state when the request fails | Unit | Passed | `frontend/src/screens/Notes.test.tsx` |
| AC-014 | Notes > [AC-014] saves via PUT /notes/{id} | Unit | Passed | `frontend/src/screens/Notes.test.tsx` |
| AC-015 | Notes > [AC-015] shows the empty state with a New note control | Unit | Passed | `frontend/src/screens/Notes.test.tsx` |
| AC-016 | Notes > [AC-016] opens a selected note loaded via GET /notes/{id} | Unit | Passed | `frontend/src/screens/Notes.test.tsx` |
| AC-017 | Notes > [AC-017] creates a note via POST and shows the Saved status | Unit | Passed | `frontend/src/screens/Notes.test.tsx` |
| AC-018 | Notes > [AC-018] blocks a whitespace-only title without a request | Unit | Passed | `frontend/src/screens/Notes.test.tsx` |
| — | Notes > [NFR-005] shows Note not found on 404 | Unit | Passed | `frontend/src/screens/Notes.test.tsx` |
| AC-013 | test_ac013_list_only_own_notes_ordered_updated_desc | Integration | Passed | `backend/tests/test_notes_api.py` |
| AC-014 | test_ac014_put_on_oldest_moves_it_first | Integration | Passed | `backend/tests/test_notes_api.py` |
| AC-015 | test_ac015_no_notes_is_empty_list | Integration | Passed | `backend/tests/test_notes_api.py` |
| AC-017 | test_ac017_create_returns_201_and_appears_first | Integration | Passed | `backend/tests/test_notes_api.py` |
| AC-018 | test_ac018_blank_title_is_422_and_stores_nothing[   ] | Integration | Passed | `backend/tests/test_notes_api.py` |
| AC-018 | test_ac018_blank_title_is_422_and_stores_nothing[\t\n] | Integration | Passed | `backend/tests/test_notes_api.py` |
| AC-018 | test_ac018_blank_title_is_422_and_stores_nothing[] | Integration | Passed | `backend/tests/test_notes_api.py` |
| AC-018 | test_ac018_blank_title_on_put_is_422_and_note_unchanged | Integration | Passed | `backend/tests/test_notes_api.py` |
| AC-019 | test_ac019_nfr006_html_stored_and_returned_unchanged | Integration | Passed | `backend/tests/test_notes_api.py` |
| — | test_nfr005_all_notes_routes_require_token | Integration | Passed | `backend/tests/test_notes_api.py` |
| — | test_nfr005_delete_own_note_204_then_404 | Integration | Passed | `backend/tests/test_notes_api.py` |
| — | test_nfr005_other_users_note_is_404_identical_to_missing | Integration | Passed | `backend/tests/test_notes_api.py` |

## Sprint 3

### US-007: Edit a note

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-020 | Note editor: edit > [AC-020] editing again after a save clears the saved confirmation | Unit | Passed | `frontend/src/screens/NoteEditor.test.tsx` |
| AC-020 | Note editor: edit > [AC-020] saves changed title and text via PUT, confirms, and reopening shows them | Unit | Passed | `frontend/src/screens/NoteEditor.test.tsx` |
| AC-021 | Note editor: edit > [AC-021] a whitespace-only title is blocked too, and typing a title clears the message | Unit | Passed | `frontend/src/screens/NoteEditor.test.tsx` |
| AC-021 | Note editor: edit > [AC-021] blocks saving a cleared title with a message and sends nothing | Unit | Passed | `frontend/src/screens/NoteEditor.test.tsx` |
| AC-022 | Note editor: edit > [AC-022] a server error (500) shows the same message and keeps the text, and save can be retried | Unit | Passed | `frontend/src/screens/NoteEditor.test.tsx` |
| AC-022 | Note editor: edit > [AC-022] shows an error and keeps entered text when the server is unreachable | Unit | Passed | `frontend/src/screens/NoteEditor.test.tsx` |
| AC-020 | test_ac020_changing_only_the_text_keeps_the_title | Integration | Passed | `backend/tests/test_note_edit_api.py` |
| AC-020 | test_ac020_put_persists_changes_and_moves_updated_at | Integration | Passed | `backend/tests/test_note_edit_api.py` |
| AC-020 | test_ac020_text_can_be_cleared_to_empty | Integration | Passed | `backend/tests/test_note_edit_api.py` |
| AC-021 | test_ac021_invalid_title_is_422_and_stored_note_unchanged[payload0] | Integration | Passed | `backend/tests/test_note_edit_api.py` |
| AC-021 | test_ac021_invalid_title_is_422_and_stored_note_unchanged[payload1] | Integration | Passed | `backend/tests/test_note_edit_api.py` |
| AC-021 | test_ac021_invalid_title_is_422_and_stored_note_unchanged[payload2] | Integration | Passed | `backend/tests/test_note_edit_api.py` |
| AC-021 | test_ac021_invalid_title_is_422_and_stored_note_unchanged[payload3] | Integration | Passed | `backend/tests/test_note_edit_api.py` |
| — | test_get_note_returns_the_documented_shape | Integration | Passed | `backend/tests/test_note_edit_api.py` |
| — | test_put_other_users_note_is_404_and_does_not_change_it | Integration | Passed | `backend/tests/test_note_edit_api.py` |
| — | test_put_unknown_note_is_404_with_detail | Integration | Passed | `backend/tests/test_note_edit_api.py` |
| AC-020 | [AC-020] GET and PUT /notes/{id} without a token are 401 | E2E | Not run yet | `frontend/e2e/edit-note.spec.ts` |
| AC-020 | [AC-020] GET and PUT on another user's or a missing note are 404 'Note not found' | E2E | Not run yet | `frontend/e2e/edit-note.spec.ts` |
| AC-020 | [AC-020] PUT /notes/{id} returns 200 with the updated note and a later updated_at | E2E | Not run yet | `frontend/e2e/edit-note.spec.ts` |
| AC-020 | [AC-020] user edits title and text, saves, and reopening shows the new content | E2E | Not run yet | `frontend/e2e/edit-note.spec.ts` |
| AC-021 | [AC-021] PUT with an empty, blank or missing title is 422 and leaves the note unchanged | E2E | Not run yet | `frontend/e2e/edit-note.spec.ts` |
| AC-021 | [AC-021] clearing the title blocks saving with a message and the stored note is unchanged | E2E | Not run yet | `frontend/e2e/edit-note.spec.ts` |
| AC-022 | [AC-022] a failed save shows an error and the entered text stays in the editor | E2E | Not run yet | `frontend/e2e/edit-note.spec.ts` |

### US-009: Notes are visible only to their owner

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-026 | test_ac026_each_user_lists_exactly_their_own_notes | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-027 | test_ac027_other_users_attempts_leave_note_and_list_unchanged | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-027 | test_ac027_refusal_body_reveals_nothing | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_garbage_token_is_401_on_every_notes_endpoint[delete-/notes/00000000-0000-0000-0000-0000000000aa-kw4] | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_garbage_token_is_401_on_every_notes_endpoint[get-/notes-kw0] | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_garbage_token_is_401_on_every_notes_endpoint[get-/notes/00000000-0000-0000-0000-0000000000aa-kw2] | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_garbage_token_is_401_on_every_notes_endpoint[post-/notes-kw1] | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_garbage_token_is_401_on_every_notes_endpoint[put-/notes/00000000-0000-0000-0000-0000000000aa-kw3] | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_non_bearer_header_is_401_on_every_notes_endpoint[delete-/notes/00000000-0000-0000-0000-0000000000aa-kw4] | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_non_bearer_header_is_401_on_every_notes_endpoint[get-/notes-kw0] | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_non_bearer_header_is_401_on_every_notes_endpoint[get-/notes/00000000-0000-0000-0000-0000000000aa-kw2] | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_non_bearer_header_is_401_on_every_notes_endpoint[post-/notes-kw1] | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_non_bearer_header_is_401_on_every_notes_endpoint[put-/notes/00000000-0000-0000-0000-0000000000aa-kw3] | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-028 | test_ac028_signed_out_token_is_rejected_and_reveals_no_notes | Integration | Passed | `backend/tests/test_notes_privacy_api.py` |
| AC-026 | [AC-026] A's Notes list shows only A's notes | E2E | Not run yet | `frontend/e2e/note-privacy.spec.ts` |
| AC-026 | [AC-026] the list API returns only the caller's notes | E2E | Not run yet | `frontend/e2e/note-privacy.spec.ts` |
| AC-027 | [AC-027] B opening A's note by URL sees not-found and none of its content | E2E | Not run yet | `frontend/e2e/note-privacy.spec.ts` |
| AC-027 | [AC-027] B's GET, PUT and DELETE on A's note are refused as 404 and change nothing | E2E | Not run yet | `frontend/e2e/note-privacy.spec.ts` |
| AC-028 | [AC-028] a signed-out visitor opening the notes screen is sent to sign-in | E2E | Not run yet | `frontend/e2e/note-privacy.spec.ts` |
| AC-028 | [AC-028] after signing out, the old token is rejected by the API | E2E | Not run yet | `frontend/e2e/note-privacy.spec.ts` |
| AC-028 | [AC-028] every notes endpoint rejects a request without sign-in as 401 | E2E | Not run yet | `frontend/e2e/note-privacy.spec.ts` |

### US-010: No sharing or discovery features

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-029 | test_ac029_note_schemas_have_no_sharing_tag_or_format_fields | Integration | Passed | `backend/tests/test_no_sharing_api.py` |
| AC-029 | test_ac029_openapi_declares_only_the_approved_routes | Integration | Passed | `backend/tests/test_no_sharing_api.py` |
| AC-029 | test_ac029_search_query_does_not_filter_the_list | Integration | Passed | `backend/tests/test_no_sharing_api.py` |
| AC-029 | test_ac029_sharing_and_search_urls_do_not_exist | Integration | Passed | `backend/tests/test_no_sharing_api.py` |
| AC-029 | test_ac029_tag_and_share_fields_are_not_stored_or_returned | Integration | Passed | `backend/tests/test_no_sharing_api.py` |
| AC-029 | test_ac029_text_is_stored_verbatim_as_plain_text | Integration | Passed | `backend/tests/test_no_sharing_api.py` |
| AC-029 | [AC-029] API exposes no share, tag, search or collaborator endpoints | E2E | Not run yet | `frontend/e2e/no-sharing.spec.ts` |
| AC-029 | [AC-029] Note editor is a plain title and text form with no sharing, tag or format controls | E2E | Not run yet | `frontend/e2e/no-sharing.spec.ts` |
| AC-029 | [AC-029] Notes list offers no share, tag or search controls | E2E | Not run yet | `frontend/e2e/no-sharing.spec.ts` |
| AC-029 | [AC-029] formatting characters are saved and shown as plain text | E2E | Not run yet | `frontend/e2e/no-sharing.spec.ts` |
| AC-029 | [AC-029] list ignores search parameters and notes carry no tag or share fields | E2E | Not run yet | `frontend/e2e/no-sharing.spec.ts` |

### US-011: Use the app on phone and desktop

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-030 | Responsive layout > [AC-030] stacks the menu on narrow screens, beside content from md up, notes as a list | Unit | Passed | `frontend/src/Responsive.test.tsx` |
| AC-030 | [AC-030] Login: no horizontal scroll, sign in and sign up controls usable | E2E | Not run yet | `frontend/e2e/responsive.spec.ts` |
| AC-030 | [AC-030][NFR-013] Note editor: Save, Close, Delete, Sign out usable | E2E | Not run yet | `frontend/e2e/responsive.spec.ts` |
| AC-030 | [AC-030][NFR-013] Notes list with several notes and a long title | E2E | Not run yet | `frontend/e2e/responsive.spec.ts` |
| AC-031 | [AC-031] Notes list and editor stay within a sensible width | E2E | Not run yet | `frontend/e2e/responsive.spec.ts` |
| AC-031 | [AC-031][NFR-013] Login is readable and not stretched | E2E | Not run yet | `frontend/e2e/responsive.spec.ts` |

### US-015: Basic setup and usage guide

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-040 | test_ac040_setup_covers_database_start_and_login[/login\|Login] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-040 | test_ac040_setup_covers_database_start_and_login[DATABASE_URL] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-040 | test_ac040_setup_covers_database_start_and_login[alembic\|migrat] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-040 | test_ac040_setup_covers_database_start_and_login[npm run dev] | Unit | Passed | `backend/tests/test_setup_docs.py` |
| AC-040 | test_ac040_setup_covers_database_start_and_login[postgresql+psycopg] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-040 | test_ac040_setup_covers_database_start_and_login[uvicorn] | Unit | Passed | `backend/tests/test_setup_docs.py` |
| AC-040 | test_ac040_setup_mentions_postgresql_and_install_steps | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_explains_each_action[creat] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_explains_each_action[delet] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_explains_each_action[edit] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_explains_each_action[regist\|sign up] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_explains_each_action[sign in\|log ?in] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_explains_each_action[sign out\|log ?out] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_lists_v1_limits[email verification] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_lists_v1_limits[password reset] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_lists_v1_limits[search] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_lists_v1_limits[sharing] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_lists_v1_limits[social login] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| AC-041 | test_ac041_usage_lists_v1_limits[tags] | Unit | Failed | `backend/tests/test_setup_docs.py` |
| — | test_nfr016_documentation_is_short | Unit | Passed | `backend/tests/test_setup_docs.py` |
| AC-040 | [AC-040] a fresh visitor of the running app reaches the Login screen | E2E | Not run yet | `frontend/e2e/setup-guide.spec.ts` |
| AC-040 | [AC-040] the backend the guide starts answers its health check | E2E | Not run yet | `frontend/e2e/setup-guide.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_nothing_is_seeded_without_the_bootstrap_settings | Unit | Passed | `backend/tests/test_seed.py` |
| — | test_the_admin_is_seeded_once | Unit | Passed | `backend/tests/test_seed.py` |
| — | App > opens on Login, with no menu around it | Unit | Passed | `frontend/src/App.test.tsx` |
| — | test_health_reports_ok | Integration | Passed | `backend/tests/test_health.py` |
| — | test_the_openapi_document_builds | Integration | Passed | `backend/tests/test_health.py` |
| AC-023 | [AC-023] choosing Delete shows a confirmation and the note still exists | E2E | Not run yet | `frontend/e2e/delete-note.spec.ts` |
| AC-024 | [AC-024] confirming deletes the note; it is gone from the list, also after reload | E2E | Not run yet | `frontend/e2e/delete-note.spec.ts` |
| AC-025 | [AC-025] cancelling keeps the note unchanged | E2E | Not run yet | `frontend/e2e/delete-note.spec.ts` |
| — | the app loads | E2E | Passed | `frontend/e2e/example.spec.ts` |
| AC-029 | [AC-029] HTML typed into a note is stored and shown as plain text, not rendered | E2E | Not run yet | `frontend/e2e/no-sharing-v1.spec.ts` |
| AC-029 | [AC-029] Login screen has no share, tag, search or formatting controls | E2E | Not run yet | `frontend/e2e/no-sharing-v1.spec.ts` |
| AC-029 | [AC-029] OpenAPI lists no share, tag or search routes and GET /notes has no filter parameter | E2E | Not run yet | `frontend/e2e/no-sharing-v1.spec.ts` |
| AC-029 | [AC-029] q and tag query parameters do not change the GET /notes result | E2E | Not run yet | `frontend/e2e/no-sharing-v1.spec.ts` |
| AC-029 | [AC-029] the note text field is a plain textarea and there is no toolbar | E2E | Not run yet | `frontend/e2e/no-sharing-v1.spec.ts` |
| AC-028 | [AC-028] invalid and revoked tokens get 401 on every notes endpoint | E2E | Not run yet | `frontend/e2e/note-privacy-auth.spec.ts` |
| — | [NFR-005] refusal of another user's note uses the {detail} shape without content | E2E | Not run yet | `frontend/e2e/note-privacy-auth.spec.ts` |
<!-- sdlc:auto:end tests -->
