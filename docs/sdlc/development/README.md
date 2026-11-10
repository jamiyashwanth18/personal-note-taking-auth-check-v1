# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

The development plan is approved at version 1. It has three sprints of 20 capacity each, six epics, fifteen stories and three tasks.

- Plan status: approved, version 1.
- Sprints: Sprint 1, Sprint 2, Sprint 3, each with capacity 20 (total 60).
- Epics: EPIC-001 to EPIC-006. Epics have no points and no assigned role.
- Stories: US-001 to US-015, totalling 49 points (sum of the listed story points).
- Tasks: US-012-T1, US-012-T2, US-012-T3. These have no points.
- Roles assigned: frontend-agent, backend-agent, security-agent, qa-agent, devops-agent.
- Not stated in input: approver, approval date, explicit story-to-sprint mapping.

**Related:** DEV-SPRINT-1, DEV-SPRINT-2, DEV-SPRINT-3, EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006

### DEV-SPRINT-1 · approved · source: plan:SPRINT-1

Sprint 1 targets the backend foundation, with capacity 20. No ticket in the run records delivery of a backend item.

- Goal: backend foundation. This covers the database schema, password hashing and sessions, the user-scoped notes API, and a self-contained run setup.
- Capacity: 20.
- Related IDs reflect stories whose titles match the goal wording. The input gives no explicit sprint assignment.
- Delivery: no ticket records exist for US-004, US-012 (incl. T1 to T3), US-013 or US-014.

**Related:** DEV-PLAN-V1, US-004, US-012, US-013, US-014

### DEV-SPRINT-2 · approved · source: plan:SPRINT-2

Sprint 2 targets register, sign in, sign out, the Notes list and note creation, with capacity 20. All five matching stories have delivered tickets.

- Goal: users can register, sign in, sign out, see their Notes list and create notes.
- Capacity: 20.
- Related IDs reflect stories whose titles match the goal wording. The input gives no explicit sprint assignment.
- Delivered tickets: US-001, US-002, US-003 (commit ac66d94f8fd00853b064f5a5908092fe6ef1fe7f). Also US-005, US-006 (commit 9abe997403065ce129b1d98809ba34280be7f984).
- Delivered story points: 18 (5+5+2+3+3).

**Related:** DEV-PLAN-V1, US-001, US-002, US-003, US-005, US-006

### DEV-SPRINT-3 · approved · source: plan:SPRINT-3

Sprint 3 targets edit and delete, per-user privacy verification, responsive layout, scope check and documentation, with capacity 20. No ticket records delivery of these items.

- Goal: edit and delete notes, verified per-user privacy, responsive layout, scope check and documentation.
- Capacity: 20.
- Related IDs reflect stories whose titles match the goal wording. The input gives no explicit sprint assignment.
- Delivery: no ticket records exist for US-007, US-008, US-009, US-010, US-011 or US-015.

**Related:** DEV-PLAN-V1, US-007, US-008, US-009, US-010, US-011, US-015

### EPIC-001 · approved · source: plan:EPIC-001

This epic covers accounts and sign-in. Three of its four stories have delivered tickets; the security story has none.

- US-001 Register from the Login screen: 5 pts, frontend-agent. Delivered.
- US-002 Sign in with email and password: 5 pts, frontend-agent. Delivered.
- US-003 Sign out: 2 pts, frontend-agent. Delivered.
- US-004 Session and password security: 5 pts, security-agent. No ticket record.

**Related:** US-001, US-002, US-003, US-004

### EPIC-002 · approved · source: plan:EPIC-002

This epic covers the Notes list and note management. View and create are delivered; edit and delete have no ticket records.

- US-005 View my notes list: 3 pts, frontend-agent. Delivered.
- US-006 Create a note: 3 pts, frontend-agent. Delivered.
- US-007 Edit a note: 3 pts, frontend-agent. No ticket record.
- US-008 Delete a note with confirmation: 2 pts, frontend-agent. No ticket record.

**Related:** US-005, US-006, US-007, US-008

### EPIC-003 · approved · source: plan:EPIC-003

This epic covers privacy and per-user isolation, owned by qa-agent stories. Neither story has a delivery or verification record.

- US-009 Notes are visible only to their owner: 3 pts, qa-agent. No ticket record.
- US-010 No sharing or discovery features: 1 pt, qa-agent. No ticket record.
- Per-user isolation has not been documented as verified.

**Related:** US-009, US-010

### EPIC-004 · approved · source: plan:EPIC-004

This epic covers the responsive web interface. Its one story has no delivery record.

- US-011 Use the app on phone and desktop: 3 pts, frontend-agent. No ticket record.

**Related:** US-011

### EPIC-005 · approved · source: plan:EPIC-005

This epic covers the notes and accounts API, PostgreSQL storage and the self-contained run setup. None of its stories or tasks have delivery records.

- US-012 Accounts and notes API: 8 pts, backend-agent. No ticket record. Its tasks:
  - US-012-T1 Scaffold API app with CORS, error handler and health check: backend-agent.
  - US-012-T2 Implement user-scoped notes CRUD endpoints: backend-agent.
  - US-012-T3 Add API integration test suite: qa-agent.
- US-013 Persist users and notes in PostgreSQL: 3 pts, backend-agent. No ticket record.
- US-014 No external services needed: 1 pt, devops-agent. No ticket record.

**Related:** US-012, US-012-T1, US-012-T2, US-012-T3, US-013, US-014

### EPIC-006 · approved · source: plan:EPIC-006

This epic covers setup and usage documentation. Its one story has no delivery record.

- US-015 Basic setup and usage guide: 2 pts, devops-agent. No ticket record.

**Related:** US-015

### DEV-US-001 · draft · source: dev:US-001

The ticket 'Register from the Login screen' was delivered.

- Status: delivered.
- Commit: ac66d94f8fd00853b064f5a5908092fe6ef1fe7f. This is a shared commit with US-002 and US-003.
- Planned: 5 pts, frontend-agent.
- No review, approval or test result is recorded in the input.

**Related:** US-001, EPIC-001, DEV-SPRINT-2

### DEV-US-002 · draft · source: dev:US-002

The ticket 'Sign in with email and password' was delivered.

- Status: delivered.
- Commit: ac66d94f8fd00853b064f5a5908092fe6ef1fe7f. This is a shared commit with US-001 and US-003.
- Planned: 5 pts, frontend-agent.
- No review, approval or test result is recorded in the input.

**Related:** US-002, EPIC-001, DEV-SPRINT-2

### DEV-US-003 · draft · source: dev:US-003

The ticket 'Sign out' was delivered.

- Status: delivered.
- Commit: ac66d94f8fd00853b064f5a5908092fe6ef1fe7f. This is a shared commit with US-001 and US-002.
- Planned: 2 pts, frontend-agent.
- No review, approval or test result is recorded in the input.

**Related:** US-003, EPIC-001, DEV-SPRINT-2

### DEV-US-005 · draft · source: dev:US-005

The ticket 'View my notes list' was delivered.

- Status: delivered.
- Commit: 9abe997403065ce129b1d98809ba34280be7f984. This is a shared commit with US-006.
- Planned: 3 pts, frontend-agent.
- No review, approval or test result is recorded in the input.

**Related:** US-005, EPIC-002, DEV-SPRINT-2

### DEV-US-006 · draft · source: dev:US-006

The ticket 'Create a note' was delivered.

- Status: delivered.
- Commit: 9abe997403065ce129b1d98809ba34280be7f984. This is a shared commit with US-005.
- Planned: 3 pts, frontend-agent.
- No review, approval or test result is recorded in the input.

**Related:** US-006, EPIC-002, DEV-SPRINT-2

### DEV-RUN-STATUS · draft · source: dev:run

The development run is reported as completed, but only 5 of 15 planned stories have delivery records. Both facts are recorded here without resolution.

- Version A, from the run status: 'completed'.
- Version B, from the ticket list: only US-001, US-002, US-003, US-005 and US-006 are delivered (18 of 49 story points).
- Not delivered (no ticket record):
  - Stories: US-004, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015.
  - Tasks: US-012-T1, US-012-T2, US-012-T3.
- Gaps that cannot be resolved from the input:
  - There is no record of the backend work (US-012, US-013) that the delivered frontend stories appear to rely on.
  - Edit and delete are not recorded as delivered.
  - Security (US-004) is not recorded as delivered.
  - Privacy verification (US-009) is not recorded as delivered.
- Needs human confirmation: whether the remaining items were descoped, deferred, delivered under other tickets, or are outstanding.

**Related:** DEV-PLAN-V1, US-004, US-007, US-008, US-009, US-010, US-011, US-012, US-012-T1, US-012-T2, US-012-T3, US-013, US-014, US-015
<!-- sdlc:auto:end narrative -->
