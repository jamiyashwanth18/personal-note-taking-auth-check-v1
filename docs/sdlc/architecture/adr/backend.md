<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-10

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Django
- Express

## Decision Outcome

Chosen option: FastAPI 0.115, because Approved stack. Pydantic models give the validation messages, and a get_current_user dependency enforces auth on every notes route. The cookie sessions in the approved rationale are replaced by opaque bearer tokens because the SPA and the API are on different origins.

## Consequences

Hand-rolled session handling is a small amount of code, but it must be tested carefully (expiry, revocation, timing-safe login).
<!-- sdlc:auto:end adr -->