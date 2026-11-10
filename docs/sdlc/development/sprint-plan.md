# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Backend foundation: database schema, password hashing and sessions, user-scoped notes API, and a self-contained run setup

Capacity: 20 points · Committed: 17

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-004 | Story | Session and password security | 5 | security-agent | US-013 |
| US-012 | Story | Accounts and notes API | 8 | backend-agent | US-013, US-004 |
| ↳ US-012-T1 | Task | Scaffold API app with CORS, error handler and health check | — | backend-agent | — |
| ↳ US-012-T2 | Task | Implement user-scoped notes CRUD endpoints | — | backend-agent | — |
| ↳ US-012-T3 | Task | Add API integration test suite | — | qa-agent | — |
| US-013 | Story | Persist users and notes in PostgreSQL | 3 | backend-agent | — |
| US-014 | Story | No external services needed | 1 | devops-agent | — |

## Sprint 2: Sprint 2

Users can register, sign in, sign out, see their Notes list and create notes

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Register from the Login screen | 5 | frontend-agent | US-004, US-012 |
| US-002 | Story | Sign in with email and password | 5 | frontend-agent | US-001 |
| US-003 | Story | Sign out | 2 | frontend-agent | US-002 |
| US-005 | Story | View my notes list | 3 | frontend-agent | US-002, US-012 |
| US-006 | Story | Create a note | 3 | frontend-agent | US-005 |

## Sprint 3: Sprint 3

Edit and delete notes, verified per-user privacy, responsive layout, scope check and documentation

Capacity: 20 points · Committed: 14

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-007 | Story | Edit a note | 3 | frontend-agent | US-006 |
| US-008 | Story | Delete a note with confirmation | 2 | frontend-agent | US-007 |
| US-009 | Story | Notes are visible only to their owner | 3 | qa-agent | US-012, US-004, US-005 |
| US-010 | Story | No sharing or discovery features | 1 | qa-agent | US-008 |
| US-011 | Story | Use the app on phone and desktop | 3 | frontend-agent | US-001, US-005, US-008 |
| US-015 | Story | Basic setup and usage guide | 2 | devops-agent | US-014, US-011 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
