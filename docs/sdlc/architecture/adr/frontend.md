<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-11-10

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Vue
- Svelte

## Decision Outcome

Chosen option: React 19, because Approved stack. In this design it is a Vite-built TypeScript SPA with three routes and a mobile-first responsive layout in plain CSS. An auth context holds the token in localStorage and handles 401 by redirecting to Login.

## Consequences

localStorage tokens are readable by injected script. This is mitigated by rendering note content only as text (no HTML injection paths), a strict CSP on CloudFront, and server-side revocation and expiry.
<!-- sdlc:auto:end adr -->