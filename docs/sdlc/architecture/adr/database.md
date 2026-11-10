<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-10

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- SQLite
- MySQL

## Decision Outcome

Chosen option: PostgreSQL 16, because Approved stack. It holds users, notes and sessions with unique and foreign-key constraints that enforce data integrity (NFR-011). A composite index serves the list query.

## Consequences

Needs a managed instance rather than a file, but it grows safely past hundreds of users.
<!-- sdlc:auto:end adr -->