# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:version-1

The development plan for the Personal Notes app is approved at version 1. It has three sprints, six epics, 15 stories and three tasks. No execution or progress data has been supplied yet.

- Plan status: approved, version 1. Approver and date were not provided.
- Sprints: Sprint 1, Sprint 2 and Sprint 3, each with capacity 20 (60 total).
- Epics: EPIC-001 to EPIC-006, all unassigned and unpointed.
- Stories: US-001 to US-015, 49 story points in total.
- Tasks: US-012-T1, US-012-T2 and US-012-T3, unpointed.
- Roles used: frontend-agent, backend-agent, security-agent, qa-agent and devops-agent.
- Story-to-sprint assignment is NOT given in the input. Sprint goals suggest a grouping, but no mapping is recorded here.
- Epic membership below is inferred from the item listing order (each story follows its epic). This is not an explicit parent field.
- Gaps: there are no ticket statuses, completion records, commits, test results or dates. No item can be documented as implemented.

**Related:** DEV-SPRINT-1, DEV-SPRINT-2, DEV-SPRINT-3, DEV-EPIC-001, DEV-EPIC-002, DEV-EPIC-003, DEV-EPIC-004, DEV-EPIC-005, DEV-EPIC-006

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 focuses on the backend foundation, with a capacity of 20 points.

- Goal (verbatim): Backend foundation: database schema, password hashing and sessions, user-scoped notes API, and a self-contained run setup.
- Capacity: 20.
- Assigned items: not specified in input.
- Outcome: not reported.

**Related:** DEV-PLAN-V1

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 targets the core user flows: register, sign in, sign out, view the Notes list and create notes. Capacity is 20 points.

- Goal (verbatim): Users can register, sign in, sign out, see their Notes list and create notes.
- Capacity: 20.
- Assigned items: not specified in input.
- Outcome: not reported.

**Related:** DEV-PLAN-V1

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 covers edit and delete, per-user privacy verification, responsive layout, a scope check and documentation. Capacity is 20 points.

- Goal (verbatim): Edit and delete notes, verified per-user privacy, responsive layout, scope check and documentation.
- Capacity: 20.
- Assigned items: not specified in input.
- Outcome: not reported.

**Related:** DEV-PLAN-V1

### DEV-EPIC-001 · approved · source: plan:EPIC-001

Accounts and sign-in epic: registration, sign-in, sign-out and session/password security. It holds four stories totalling 17 points.

- EPIC-001: Accounts and sign-in (points=None, role unassigned).
- US-001: Register from the Login screen. 5 pts, frontend-agent.
- US-002: Sign in with email and password. 5 pts, frontend-agent.
- US-003: Sign out. 2 pts, frontend-agent.
- US-004: Session and password security. 5 pts, security-agent.
- Note: the project description mentions only signing in with email and password. Registration (US-001) appears in the plan and the Sprint 2 goal but not in the description. Both versions are recorded here for confirmation.
- Status of work: not reported.

**Related:** US-001, US-002, US-003, US-004

### DEV-EPIC-002 · approved · source: plan:EPIC-002

Notes list and note management epic: view, create, edit and delete notes. It holds four stories totalling 11 points.

- EPIC-002: Notes list and note management (points=None, role unassigned).
- US-005: View my notes list. 3 pts, frontend-agent.
- US-006: Create a note. 3 pts, frontend-agent.
- US-007: Edit a note. 3 pts, frontend-agent.
- US-008: Delete a note with confirmation. 2 pts, frontend-agent.
- Status of work: not reported.

**Related:** US-005, US-006, US-007, US-008

### DEV-EPIC-003 · approved · source: plan:EPIC-003

Privacy and per-user isolation epic: notes are visible only to their owner, with no sharing or discovery. It holds two QA-owned stories totalling 4 points.

- EPIC-003: Privacy and per-user isolation (points=None, role unassigned).
- US-009: Notes are visible only to their owner. 3 pts, qa-agent.
- US-010: No sharing or discovery features. 1 pt, qa-agent.
- Sprint 3 goal references 'verified per-user privacy' and a 'scope check'.
- Status of work: not reported.

**Related:** US-009, US-010

### DEV-EPIC-004 · approved · source: plan:EPIC-004

Responsive web interface epic: the app should be usable on phone and desktop. It holds one story of 3 points.

- EPIC-004: Responsive web interface (points=None, role unassigned).
- US-011: Use the app on phone and desktop. 3 pts, frontend-agent.
- Status of work: not reported.

**Related:** US-011

### DEV-EPIC-005 · approved · source: plan:EPIC-005

API and storage epic: the accounts/notes API, PostgreSQL persistence and a self-contained setup. It holds three stories totalling 12 points, plus three tasks under US-012.

- EPIC-005: Notes and accounts API and storage (points=None, role unassigned).
- US-012: Accounts and notes API. 8 pts, backend-agent.
  - US-012-T1: Scaffold API app with CORS, error handler and health check. Unpointed, backend-agent.
  - US-012-T2: Implement user-scoped notes CRUD endpoints. Unpointed, backend-agent.
  - US-012-T3: Add API integration test suite. Unpointed, qa-agent.
- US-013: Persist users and notes in PostgreSQL. 3 pts, backend-agent.
- US-014: No external services needed. 1 pt, devops-agent.
- Sprint 1 goal references the database schema, password hashing and sessions, the user-scoped notes API and a self-contained run setup.
- Status of work: not reported.

**Related:** US-012, US-013, US-014

### DEV-EPIC-006 · approved · source: plan:EPIC-006

Setup and usage documentation epic. It holds one story of 2 points.

- EPIC-006: Setup and usage documentation (points=None, role unassigned).
- US-015: Basic setup and usage guide. 2 pts, devops-agent.
- Sprint 3 goal references documentation.
- Status of work: not reported.

**Related:** US-015
<!-- sdlc:auto:end narrative -->
