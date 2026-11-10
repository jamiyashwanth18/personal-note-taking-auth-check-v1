# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
40 tests · Passed 40 · Failed 0 · Skipped 0 · Not run 0

Acceptance criteria covered: 15/41 · passing: 15/41
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-012: Accounts and notes API

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-002 | test_ac002_case_variant_duplicate_leaves_one_row | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-003 | test_ac003_invalid_registration_is_422_and_creates_no_user[payload0-email] | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-003 | test_ac003_invalid_registration_is_422_and_creates_no_user[payload1-password] | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-003 | test_ac003_invalid_registration_is_422_and_creates_no_user[payload2-password] | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-003 | test_ac003_invalid_registration_is_422_and_creates_no_user[payload3-email] | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-007 | test_ac007_notes_require_token | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-010 | test_ac010_password_is_hashed_and_never_leaked | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-011 | test_ac011_activity_within_window_keeps_session | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-011 | test_ac011_idle_session_expires | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-012 | test_ac012_logout_revokes_token | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-033 | test_ac033_happy_path | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_duplicate_and_invalid_input | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_login_failures_share_one_message | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_missing_or_malformed_token_is_401[headers0] | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_missing_or_malformed_token_is_401[headers1] | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_missing_or_malformed_token_is_401[headers2] | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_missing_or_malformed_token_is_401[headers3] | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-034 | test_ac034_unhandled_error_is_500_without_traceback | Unit | Passed | `backend/tests/test_auth_api.py` |
| AC-037 | test_ac037_duplicate_email_rejected_by_database | Unit | Passed | `backend/tests/test_auth_api.py` |
| — | test_nfr005_notes_private_to_owner | Unit | Passed | `backend/tests/test_auth_api.py` |
| — | test_nfr007_error_responses_hide_internals | Unit | Passed | `backend/tests/test_auth_api.py` |
| — | test_nfr011_note_without_user_id_rejected_by_database | Unit | Passed | `backend/tests/test_auth_api.py` |
| — | test_nfr014_cors_preflight_and_no_cookie | Unit | Passed | `backend/tests/test_auth_api.py` |

## Sprint 2

### US-005: View my notes list

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-013 | test_ac013_list_only_own_notes_ordered_updated_desc | Unit | Passed | `backend/tests/test_notes_api.py` |
| AC-014 | test_ac014_put_on_oldest_moves_it_first | Unit | Passed | `backend/tests/test_notes_api.py` |
| AC-015 | test_ac015_no_notes_is_empty_list | Unit | Passed | `backend/tests/test_notes_api.py` |
| AC-017 | test_ac017_create_returns_201_and_appears_first | Unit | Passed | `backend/tests/test_notes_api.py` |
| AC-018 | test_ac018_blank_title_is_422_and_stores_nothing[   ] | Unit | Passed | `backend/tests/test_notes_api.py` |
| AC-018 | test_ac018_blank_title_is_422_and_stores_nothing[\t\n] | Unit | Passed | `backend/tests/test_notes_api.py` |
| AC-018 | test_ac018_blank_title_is_422_and_stores_nothing[] | Unit | Passed | `backend/tests/test_notes_api.py` |
| AC-018 | test_ac018_blank_title_on_put_is_422_and_note_unchanged | Unit | Passed | `backend/tests/test_notes_api.py` |
| AC-019 | test_ac019_nfr006_html_stored_and_returned_unchanged | Unit | Passed | `backend/tests/test_notes_api.py` |
| — | test_nfr005_all_notes_routes_require_token | Unit | Passed | `backend/tests/test_notes_api.py` |
| — | test_nfr005_delete_own_note_204_then_404 | Unit | Passed | `backend/tests/test_notes_api.py` |
| — | test_nfr005_other_users_note_is_404_identical_to_missing | Unit | Passed | `backend/tests/test_notes_api.py` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_health_reports_ok | Unit | Passed | `backend/tests/test_health.py` |
| — | test_the_openapi_document_builds | Unit | Passed | `backend/tests/test_health.py` |
| — | test_nothing_is_seeded_without_the_bootstrap_settings | Unit | Passed | `backend/tests/test_seed.py` |
| — | test_the_admin_is_seeded_once | Unit | Passed | `backend/tests/test_seed.py` |
| — | the app loads | E2E | Passed | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
