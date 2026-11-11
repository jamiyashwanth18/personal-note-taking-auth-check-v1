# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-RUN-CHECKS · draft · source: testing:run_checks

The aggregate project check run failed, with 6 of 8 checks passing. It was not tied to a specific ticket. The input does not name the failing checks.

- Step: run_checks (ticket: none)
- Status: failed
- Result: 6/8 checks passed (2 failed)
- Failing check names and failure reasons: not provided in input
- Possible tension with the latest E2E run (41/41 passed, sandbox). See TEST-E2E-LATEST. Both results are recorded as given. The input does not say whether the two failing checks are E2E-related or something else (e.g. lint, unit tests, build).
- Root cause, remediation and owner: not provided in input

**Related:** TEST-E2E-LATEST, TEST-OPEN-ISSUES

### TEST-c38cbfeb · draft · source: testing:write_tests:c38cbfeb-b33a-4e99-b09d-c7ded3ab817d

Tests were added at three levels (frontend unit, backend API and browser E2E) for acceptance criteria AC-020, AC-021 and AC-022. They cover the note editor and the GET/PUT /notes/{id} endpoints. All are reported passing locally.

- Ticket: c38cbfeb-b33a-4e99-b09d-c7ded3ab817d
- Status: succeeded
- Acceptance criteria covered: AC-020, AC-021, AC-022
- Tests added:
  - Vitest: note editor component tests (frontend)
  - pytest: GET /notes/{id} and PUT /notes/{id} (backend API)
  - Playwright: 3 browser flows + 4 API-contract specs (7 specs total)
- Result: all pass locally, including the 7 Playwright specs run against the booted app
- Environment: local (not stated to have run in CI)
- AC-to-user-story (US-xxx) mapping: not provided in input

**Related:** c38cbfeb-b33a-4e99-b09d-c7ded3ab817d, AC-020, AC-021, AC-022

### TEST-ef6637d5 · draft · source: testing:write_tests:ef6637d5-4073-421a-980a-cc788bbf67e6

Note-privacy tests were added at the API and UI levels for AC-026, AC-027 and AC-028. The pytest suite passes against real PostgreSQL. The Playwright spec passes only when ALLOWED_ORIGINS is set to the preview origin.

- Ticket: ef6637d5-4073-421a-980a-cc788bbf67e6
- Status: succeeded
- Acceptance criteria covered: AC-026, AC-027, AC-028 (note privacy)
- Files added:
  - backend/tests/test_notes_privacy_api.py: 14 pytest cases
  - frontend/e2e/note-privacy.spec.ts: 7 Playwright tests
- Results:
  - pytest: passes against a real PostgreSQL database
  - Playwright: passes when ALLOWED_ORIGINS=http://localhost:4173 is set
- Caveat: the E2E pass depends on a CORS/allowed-origins environment setting. Whether CI and the sandbox set this is not stated in input.
- AC-to-user-story (US-xxx) mapping: not provided in input

**Related:** ef6637d5-4073-421a-980a-cc788bbf67e6, AC-026, AC-027, AC-028

### TEST-17e1d5cd · draft · source: testing:write_tests:17e1d5cd-ea27-4bbf-ac99-362e8b6dd990

Backend tests and Playwright specs were added for AC-029, which confirms the out-of-scope features (sharing, tags, search, rich text) are absent. The backend tests and lint/spec-listing checks pass. The Playwright specs were listed but not executed.

- Ticket: 17e1d5cd-ea27-4bbf-ac99-362e8b6dd990
- Status: succeeded (task-level)
- Acceptance criterion covered: AC-029 (no sharing, tags, search or rich text)
- Files added: test_no_sharing_api.py (backend) plus Playwright specs (file names not given)
- Results:
  - test_no_sharing_api.py: passes
  - frontend-lint: passes
  - frontend-e2e-specs: passes (specs listed only)
- Gap: the Playwright specs for AC-029 were not executed by this task. They were only enumerated.
- Whether the later 41/41 E2E run (TEST-E2E-LATEST) included these specs: not stated in input
- AC-to-user-story (US-xxx) mapping: not provided in input

**Related:** 17e1d5cd-ea27-4bbf-ac99-362e8b6dd990, AC-029

### TEST-59fe9b64 · draft · source: testing:write_tests:59fe9b64-826e-4663-bdf4-2fca9fba60df

A write_tests task succeeded and reported adding 2 test files. The input gives no information on what these tests cover or whether they pass.

- Ticket: 59fe9b64-826e-4663-bdf4-2fca9fba60df
- Status: succeeded
- Reported detail: "2 test file(s)"
- Not provided in input: file names, test framework, acceptance criteria covered, pass/fail results
- Traceability: cannot be linked to any AC or US id from the given input

**Related:** 59fe9b64-826e-4663-bdf4-2fca9fba60df

### TEST-E2E-LATEST · draft · source: testing:latest_e2e_run

The most recent end-to-end test run against the sandbox target passed all 41 tests.

- Target: sandbox
- Result: passed, 41/41
- Not provided in input: the list of specs included and the run date
- The input does not confirm whether this run included the AC-029 Playwright specs, which TEST-17e1d5cd only listed, or whether ALLOWED_ORIGINS was configured for the note-privacy spec (TEST-ef6637d5).
- Context: the aggregate run_checks step still reports failed (6/8). See TEST-RUN-CHECKS. Both results are recorded without reconciliation.

**Related:** TEST-RUN-CHECKS, TEST-c38cbfeb, TEST-ef6637d5, TEST-17e1d5cd

### TEST-OPEN-ISSUES · draft · source: testing:run_checks; testing:write_tests

This entry consolidates unresolved items from the testing phase inputs. They should be resolved or confirmed before the phase is treated as complete.

- run_checks failed (6/8). The 2 failing checks are unidentified (TEST-RUN-CHECKS).
- AC-029 Playwright specs were not executed by their authoring task (TEST-17e1d5cd).
- The note-privacy E2E spec requires ALLOWED_ORIGINS=http://localhost:4173. Environment parity is unconfirmed (TEST-ef6637d5).
- Ticket 59fe9b64 has no coverage or result details (TEST-59fe9b64).
- c38cbfeb results are local-only per the input (TEST-c38cbfeb).
- Test coverage is expressed in AC ids (AC-020 to AC-022, AC-026 to AC-029). No AC-to-US mapping was given, so US-001 to US-015 coverage cannot be traced from this input.
- ACs not referenced by any testing input (e.g. AC-001 to AC-019, AC-023 to AC-025, if they exist) have no recorded test evidence here.
- No test sign-off or approval was provided.

**Related:** TEST-RUN-CHECKS, TEST-E2E-LATEST, TEST-ef6637d5, TEST-17e1d5cd, TEST-59fe9b64
<!-- sdlc:auto:end narrative -->
