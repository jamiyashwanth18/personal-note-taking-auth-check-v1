# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-STACK · approved · source: requirements:technology-stack

The product owner approved the technology stack: FastAPI 0.115, AWS, PostgreSQL 16 and React 19. Design must use exactly these, with no substitutes.

- Backend: FastAPI 0.115. Provides the server-side API for sign-up, sign-in with hashed passwords, and per-user note create/edit/delete. It needs little code, is the platform default and fits a user base of hundreds.
- Cloud: AWS. Platform default. Nothing in the input points to another host. It hosts the API, web pages and managed Postgres together. No deadline or region requirement was stated.
- Database: PostgreSQL 16. The data is simple and relational (users and their notes). The analyst allowed SQLite or Postgres. Postgres was chosen because it is the platform default, handles concurrent saves safely, and supports growth past hundreds of users without a data migration.
- Frontend: React 19. Three screens (Login, Notes list, Note editor) that must feel instant on phone and desktop. It handles the delete confirmation and moving between screens without full page reloads. Platform default.
- Recorded conflict on session mechanism:
  - The stack rationale describes the backend as handling 'session cookies'.
  - EPIC-001 and NFR-014 say the web pages and API may be on different addresses, so no cookie-specific behaviour is required, and the session mechanism is left to design.
- Recorded conflict on confirmation status:
  - This stack section says the stack is approved by the product owner.
  - EPIC-005 says the stack is 'to be confirmed on the stack screen'.

**Related:** EPIC-005, US-004, US-012, US-013, NFR-014

### REQ-SCOPE · draft · source: requirements:scope

Requirements version 1 with a lightweight delivery scope. It covers a three-screen personal notes app with private, plain-text notes for a few hundred users.

- Delivery scope: lightweight. Requirements version: 1.
- Capabilities in scope:
  - Self sign-up and sign-in on one Login screen
  - Sign out
  - Notes list of your own notes, newest-updated first
  - Create a note
  - Note editor for title and plain text
  - Delete a note with a confirmation prompt
  - Private notes visible only to their owner
  - Responsive layout for phone and desktop
  - Notes and accounts API
  - PostgreSQL storage of users and notes
  - Basic setup and usage documentation
- Constraints:
  - Notes are plain text with a title; no rich text.
  - No sharing, collaboration, tags or search.
  - Registration lives on the Login screen; there is no separate sign-up screen.
  - No payments and no external services.
  - Sized for a small user base of hundreds of users.
- Screens: Login, Notes list, Note editor.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006

### EPIC-001 · draft · source: requirements:EPIC-001

Accounts and sign-in. Visitors self-register and sign in with email and password on one Login screen that toggles between login and sign-up.

- There is no separate sign-up screen.
- Assumptions for v1:
  - No email verification, password reset or social login.
  - Therefore no email provider is needed.
- Sign-in and session security are stated as outcomes. The session mechanism is left to design.
- The web pages and API may be on different addresses, so no cookie-specific behaviour is required. This conflicts with the 'session cookies' wording in the stack rationale; see REQ-STACK.

**Related:** US-001, US-002, US-003, US-004

### US-001 · draft · source: requirements:US-001

Priority: critical. A visitor registers with email and password from the Login screen. After registering they are signed in and land on an empty Notes list.

- AC-001: On the Login screen, the visitor switches to sign-up mode and submits a valid unused email and a valid password. An account is created, the visitor is signed in and lands on an empty Notes list.
- AC-002: Registering with an email that already exists, in any letter case, is refused with a clear message. No second account is created.
- AC-003: An invalid email format, a password shorter than 8 characters, or an empty field shows a validation message next to the problem. No account is created.
- AC-004: There is no separate sign-up screen. Registration exists only on the Login screen.

**Related:** EPIC-001, NFR-011

### US-002 · draft · source: requirements:US-002

Priority: critical. A registered user signs in with email and password and reaches their Notes list. Failed sign-ins show one generic message.

- AC-005: Correct email and password signs the user in and takes them to the Notes list.
- AC-006: A wrong password or unknown email shows a single generic 'incorrect email or password' message that does not reveal which was wrong. The user stays signed out.
- AC-007: A user who is not signed in and opens the Notes list or Note editor directly is sent to the Login screen. No note data is shown.

**Related:** EPIC-001, NFR-004

### US-003 · draft · source: requirements:US-003

Priority: high. A signed-in user can sign out at any time from the Notes list or Note editor. Afterwards the old session can no longer reach notes.

- AC-008: Choosing Sign out on the Notes list or Note editor returns the user to the Login screen.
- AC-009: After sign-out, using the browser Back button or calling a notes API endpoint with the previous session shows no notes. The request is rejected as unauthenticated.

**Related:** EPIC-001, NFR-003

### US-004 · draft · source: requirements:US-004

Priority: high. Credentials and sessions must be protected. Passwords are stored as salted hashes, and sessions expire after inactivity and on sign-out.

- AC-010: The password is stored only as a salted hash, never in plain text. It is never returned by the API or written to logs.
- AC-011: After inactivity beyond the configured session lifetime, loading or saving a note treats the session as expired and requires sign-in again.
- AC-012: After sign-out, the old session is no longer valid when reused.

**Related:** EPIC-001, NFR-001, NFR-002, NFR-003, NFR-014

### EPIC-002 · draft · source: requirements:EPIC-002

Notes list and note management. A signed-in user sees only their own notes, newest-updated first, and can create, edit and delete them.

- Notes are plain text with a title.
- No rich text, tags, search, sharing or collaboration.
- Deleting a note asks for confirmation.

**Related:** US-005, US-006, US-007, US-008

### US-005 · draft · source: requirements:US-005

Priority: critical. The Notes list shows the user's notes by title, most recently updated first. Selecting a note opens it in the editor.

- AC-013: Each of the user's notes is shown with its title, ordered by last-updated time with the newest first.
- AC-014: After an older note is edited and saved, it appears at the top of the list.
- AC-015: With no notes, the list shows an empty-state message and a control to create a note.
- AC-016: Selecting a note opens it in the Note editor.

**Related:** EPIC-002, NFR-005

### US-006 · draft · source: requirements:US-006

Priority: critical. A user creates a note with a title and plain text. The new note appears at the top of their list.

- AC-017: From the Notes list, the user chooses New note, enters a title and text, and saves. The note is stored under the user's account and appears at the top of the list.
- AC-018: Saving with an empty title is blocked with a validation message. Nothing is stored.
- AC-019: HTML or script tags in the content are shown as literal plain text after saving and reopening. They are never interpreted or executed.

**Related:** EPIC-002, NFR-006

### US-007 · draft · source: requirements:US-007

Priority: critical. A user edits the title and text of an existing note and saves the changes. Validation and save failures are handled without losing the user's input.

- AC-020: Changes to the title or text are persisted when saved. The updated time changes, and reopening the note shows the new content.
- AC-021: Clearing the title and saving is blocked with a validation message. The stored note is unchanged.
- AC-022: If a save fails (for example, the server is unreachable), an error message is shown. The entered text stays in the editor.

**Related:** EPIC-002, NFR-012

### US-008 · draft · source: requirements:US-008

Priority: high. Deleting a note requires confirmation. Confirming deletes it permanently; cancelling keeps it.

- AC-023: Choosing Delete shows a confirmation prompt. The note is not yet deleted.
- AC-024: Confirming permanently deletes the note, and it no longer appears in the Notes list.
- AC-025: Cancelling keeps the note unchanged.

**Related:** EPIC-002

### EPIC-003 · draft · source: requirements:EPIC-003

Privacy and per-user isolation. Each user sees and modifies only their own notes.

- No sharing, collaboration, tags, search or rich text.
- No specific regulation applies: the industry is general and no region was named.
- Requirements are limited to hashed passwords and basic privacy practice.

**Related:** US-009, US-010, NFR-017

### US-009 · draft · source: requirements:US-009

Priority: critical. Notes are visible only to their owner. Attempts to access another user's note are refused and reveal nothing.

- AC-026: When user A opens the Notes list, only A's notes are shown.
- AC-027: When user B requests, edits or deletes one of A's notes by API or URL, the request is refused (not found or forbidden). The note is unchanged and none of its content is revealed.
- AC-028: Calls to any notes API endpoint without a sign-in are rejected as unauthenticated.

**Related:** EPIC-003, NFR-005

### US-010 · draft · source: requirements:US-010

Priority: low. Version 1 excludes sharing, collaboration, tags, search and rich text.

- AC-029: The released screens and API offer no way to share a note, add tags, search notes, or format text beyond plain text.

**Related:** EPIC-003

### EPIC-004 · draft · source: requirements:EPIC-004

Responsive web interface. The three screens work on both phones and desktops.

- Screens: Login (with sign-up), Notes list, Note editor.

**Related:** US-011, NFR-013

### US-011 · draft · source: requirements:US-011

Priority: high. All three screens adapt to phone and desktop widths. The app has only these three screens.

- AC-030: At about 360 px width, content fits without horizontal scrolling. All controls are reachable and usable by touch.
- AC-031: At desktop width, the layout uses the space sensibly and stays readable.
- AC-032: At any size, the app provides only three screens: Login (with sign-up), Notes list and Note editor.

**Related:** EPIC-004, NFR-013

### EPIC-005 · draft · source: requirements:EPIC-005

Notes and accounts API and storage. A server-side API handles accounts and notes, backed by a PostgreSQL relational database.

- No external services, API keys or payments.
- Sized for hundreds of users. No deadline stated.
- Recorded database history: the earlier understanding allowed SQLite or Postgres. The chosen scope specifies PostgreSQL.
- Recorded conflict on confirmation status:
  - This epic says the stack is 'to be confirmed on the stack screen'.
  - The stack section says it is approved by the product owner (see REQ-STACK).

**Related:** US-012, US-013, US-014, REQ-STACK

### US-012 · draft · source: requirements:US-012

Priority: critical. An API lets the web client register, sign in and sign out. It also lets the client list, create, read, update and delete the current user's notes.

- AC-033: A valid request is performed, and the API returns a success response with the data the screen needs.
- AC-034: An invalid request (bad input, missing note, unauthenticated) returns an appropriate error status and a clear message, without exposing internal details.
- AC-035: The notes list endpoint returns only the signed-in user's notes, ordered by last-updated, newest first.

**Related:** EPIC-005, NFR-005, NFR-007, NFR-014

### US-013 · draft · source: requirements:US-013

Priority: high. Users and notes are persisted in PostgreSQL. Data survives restarts and integrity rules are enforced.

- AC-036: After a server restart, the user can sign in and all their notes are still present, with titles, text and updated times.
- AC-037: Each note belongs to exactly one user, and email addresses are unique per account.
- AC-038: With a few hundred users, each holding a modest number of notes, the Notes list and note saves respond without noticeable delay.

**Related:** EPIC-005, NFR-008, NFR-010, NFR-011

### US-014 · draft · source: requirements:US-014

Priority: medium. The app runs without third-party services, payments or API keys.

- AC-039: In a fresh environment with only the app and its database, every feature works. No email provider, payment provider or other external credential is needed.

**Related:** EPIC-005, NFR-015

### EPIC-006 · draft · source: requirements:EPIC-006

Setup and usage documentation. Basic documentation explains how to run and use the app.

- Covers setup for developers and operators.
- Covers usage for end users.

**Related:** US-015, NFR-016

### US-015 · draft · source: requirements:US-015

Priority: medium. Short documentation covers setup and use of the app, including the version 1 limits.

- AC-040: A new developer with the repository and a PostgreSQL instance can configure the database connection, start the app and reach the Login screen.
- AC-041: The usage section explains how to register, sign in, create, edit and delete notes, and sign out.
- AC-041: It also lists the v1 limits: no email verification, password reset, social login, sharing, tags or search.

**Related:** EPIC-006, NFR-016

### NFR-001 · draft · source: requirements:NFR-001

Security. Passwords are stored only as salted hashes.

- Passwords are never stored in plain text.
- Passwords are never returned by the API.
- Passwords are never written to logs.

**Related:** US-004

### NFR-002 · draft · source: requirements:NFR-002

Security. Sessions expire after a configured period of inactivity.

- After expiry, loading or saving a note requires signing in again.

**Related:** US-004

### NFR-003 · draft · source: requirements:NFR-003

Security. Signing out ends the session.

- The old session becomes invalid after sign-out.
- Reusing it, or using the browser Back button, shows no notes.
- The API rejects such requests as unauthenticated.

**Related:** US-003, US-004

### NFR-004 · draft · source: requirements:NFR-004

Security. A failed sign-in shows one generic message.

- The message is 'incorrect email or password'.
- It does not reveal whether the email or the password was wrong.

**Related:** US-002

### NFR-005 · draft · source: requirements:NFR-005

Privacy. Notes are private to their owner.

- Users can see, change and delete only their own notes.
- Requests for another user's note, by API or URL, are refused without revealing content.
- Every notes request without a valid sign-in is rejected as unauthenticated.

**Related:** US-009, US-005, US-012

### NFR-006 · draft · source: requirements:NFR-006

Security. Note content is shown as plain text only.

- HTML or script tags in titles or text are displayed as literal text.
- They are never interpreted or executed.

**Related:** US-006

### NFR-007 · draft · source: requirements:NFR-007

Security. API errors do not expose internals.

- Error responses use an appropriate status and a clear message.
- They include no internal details.

**Related:** US-012

### NFR-008 · draft · source: requirements:NFR-008

Performance. The app stays responsive for a few hundred users.

- With a few hundred users, each holding a modest number of notes, the Notes list and note saves respond without noticeable delay.

**Related:** US-013

### NFR-009 · draft · source: requirements:NFR-009

Scalability. The product is sized for hundreds of users.

- Target: hundreds of users.
- Larger scale is not required in v1.
- Applies to the whole system.

### NFR-010 · draft · source: requirements:NFR-010

Availability. Data survives server restarts.

- Users, notes, titles, text and updated times are kept in the database.
- All of them are still present after a server restart.

**Related:** US-013

### NFR-011 · draft · source: requirements:NFR-011

Maintainability. Data integrity rules are enforced in the database.

- Each note belongs to exactly one user.
- Email addresses are unique per account.
- Both rules are enforced in the stored data structure.

**Related:** US-013, US-001

### NFR-012 · draft · source: requirements:NFR-012

Usability. Entered text is kept when a save fails.

- On a failed save (for example, the server is unreachable), an error message is shown.
- The text the user entered stays in the editor.

**Related:** US-007

### NFR-013 · draft · source: requirements:NFR-013

Usability. All three screens work on phone and desktop.

- Target: about 360 px phone width and up.
- No horizontal scrolling on phones.
- Controls are usable by touch.
- On desktop, the layout uses space sensibly and stays readable.

**Related:** US-011

### NFR-014 · draft · source: requirements:NFR-014

Compatibility. The web pages and API can be served from separate addresses.

- Sign-in and session handling must work across different web addresses.
- No cookie-specific behaviour is required.
- Recorded conflict: the stack rationale mentions 'session cookies' (see REQ-STACK).

**Related:** US-004, US-012, REQ-STACK

### NFR-015 · draft · source: requirements:NFR-015

Maintainability. No external services or credentials are needed.

- The app runs with only the application and its database.
- No email provider, payment provider or other external credential is needed.

**Related:** US-014

### NFR-016 · draft · source: requirements:NFR-016

Maintainability. Setup and usage documentation is provided.

- A new developer with the repository and a PostgreSQL instance can configure the database, start the app and reach the Login screen.
- The documentation explains usage.
- It lists the v1 limits.

**Related:** US-015

### NFR-017 · draft · source: requirements:NFR-017

Compliance (accepted risk). No specific regulation is applied.

- Reason: the industry is general and no region was named.
- Only hashed passwords and basic privacy practice are required.
- Applies to the whole system.

**Related:** EPIC-003
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-11-10

**Capabilities in scope:** Self sign-up and sign-in on one Login screen, Sign out, Notes list of your own notes, newest-updated first, Create a note, Note editor for title and plain text, Delete a note with confirmation prompt, Private notes visible only to their owner, Responsive layout for phone and desktop, Notes and accounts API, PostgreSQL storage of users and notes, Basic setup and usage documentation, Notes are plain text with a title, no rich text, No sharing, collaboration, tags or search, Registration lives on the Login screen, no separate sign-up screen, No payments and no external services needed, Sized for a small user base of hundreds of users

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | You need a server-side API for sign-up, sign-in with hashed passwords and session cookies, and create/edit/delete of notes that each user can only reach for themselves. FastAPI covers this in little code and is the platform default. It is a good fit for a small user base of hundreds. |
| cloud | AWS | Nothing you said points to another host, and AWS is the platform default. It can run the API, the web pages and a managed Postgres database in one place. That suits a small private app with no stated deadline and no region requirement. |
| database | PostgreSQL | Your data is simple and relational: users, and notes that belong to a user. The analyst allowed SQLite or Postgres. I chose Postgres because it is the platform default. It also handles several people saving at once safely, and it lets you grow past hundreds of users without moving data later. |
| frontend | React | Your app has three screens (Login, Notes list, Note editor) that need to feel instant and work on phone and desktop. React handles this well, including the delete confirmation and moving between screens without full page reloads. It is the platform default, and nothing you said argues against it. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Accounts and sign-in

Visitors self-register and sign in with email and password on a single Login screen (login/sign-up toggle, no separate sign-up screen). Assumptions: no email verification, password reset or social login in v1, so no email provider is needed. Sign-in and session security are stated as outcomes; the session mechanism is left to the design (the web pages and API may be on different web addresses, so no cookie-specific behaviour is required).

### US-001: Register from the Login screen

**Priority:** critical

> As a visitor, I want to create an account with my email and password on the Login screen, so that I can start keeping private notes without a separate sign-up step.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am on the Login screen | I switch to the sign-up mode, enter a valid unused email and a valid password and submit | an account is created, I am signed in and I land on my empty Notes list |
| AC-002 | an account already exists for an email | I try to register with that email (in any letter case) | registration is refused with a clear message and no second account is created |
| AC-003 | I am on the sign-up form | I submit an invalid email format or a password shorter than 8 characters, or leave a field empty | I see a validation message next to the problem and no account is created |
| AC-004 | the application is running | I look for a sign-up page | there is no separate sign-up screen; registration exists only on the Login screen |

### US-002: Sign in with email and password

**Priority:** critical

> As a registered user, I want to sign in with my email and password on the Login screen, so that I can reach my notes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-005 | I have an account | I enter my correct email and password and submit | I am signed in and taken to my Notes list |
| AC-006 | I am on the Login screen | I submit a wrong password or an unknown email | I see a single generic 'incorrect email or password' message that does not reveal which was wrong, and I stay signed out |
| AC-007 | I am not signed in | I try to open the Notes list or Note editor directly | I am sent to the Login screen and no note data is shown |

### US-003: Sign out

**Priority:** high

> As a signed-in user, I want to sign out at any time, so that nobody else using my device can read my notes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-008 | I am signed in on the Notes list or Note editor | I choose Sign out | I am returned to the Login screen |
| AC-009 | I have just signed out | I use the browser Back button or request a notes API endpoint with my previous session | no notes are shown and the request is rejected as unauthenticated |

### US-004: Session and password security

**Priority:** high

> As a user, I want my credentials and session to be protected, so that my private notes stay private.

| ID | Given | When | Then |
|---|---|---|---|
| AC-010 | an account exists | the stored user data is inspected | the password is stored only as a salted hash, never in plain text, and is never returned by the API or written to logs |
| AC-011 | I am signed in and have been inactive beyond the configured session lifetime | I try to load or save a note | the session is treated as expired and I must sign in again |
| AC-012 | I signed out | the old session is reused | it is no longer valid |

## EPIC-002: Notes list and note management

A signed-in user sees only their own notes, newest-updated first, and can create, edit and delete them. Notes are plain text with a title; no rich text, tags, search, sharing or collaboration. Deleting asks for confirmation.

### US-005: View my notes list

**Priority:** critical

> As a signed-in user, I want to see a list of my notes with the most recently updated first, so that I can quickly find and open what I was working on.

| ID | Given | When | Then |
|---|---|---|---|
| AC-013 | I have several notes | I open the Notes list | each of my notes is shown with its title, ordered by last-updated time with the newest first |
| AC-014 | I edit an older note and save it | I return to the Notes list | that note appears at the top |
| AC-015 | I have no notes | I open the Notes list | I see an empty-state message and a control to create a note |
| AC-016 | I am on the Notes list | I select a note | it opens in the Note editor |

### US-006: Create a note

**Priority:** critical

> As a signed-in user, I want to create a new note with a title and plain text, so that I can record information.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | I am on the Notes list | I choose New note, enter a title and text and save | the note is stored under my account and appears at the top of my Notes list |
| AC-018 | I am creating a note | I try to save with an empty title | saving is blocked with a validation message and nothing is stored |
| AC-019 | I enter text containing HTML or script tags | I save and reopen the note | the content is shown as literal plain text and is not interpreted or executed |

### US-007: Edit a note

**Priority:** critical

> As a signed-in user, I want to change the title and text of an existing note in the Note editor, so that my notes stay up to date.

| ID | Given | When | Then |
|---|---|---|---|
| AC-020 | I opened one of my notes | I change the title or text and save | the changes are persisted, the updated time changes, and reopening the note shows the new content |
| AC-021 | I am editing a note | I clear the title and try to save | saving is blocked with a validation message and the stored note is unchanged |
| AC-022 | a save fails (for example the server is unreachable) | I press save | I see an error message and my entered text remains in the editor |

### US-008: Delete a note with confirmation

**Priority:** high

> As a signed-in user, I want to be asked to confirm before a note is deleted, so that I do not lose a note by accident.

| ID | Given | When | Then |
|---|---|---|---|
| AC-023 | I am viewing one of my notes | I choose Delete | a confirmation prompt appears and the note is not yet deleted |
| AC-024 | the confirmation prompt is shown | I confirm | the note is permanently deleted and no longer appears in my Notes list |
| AC-025 | the confirmation prompt is shown | I cancel | the note is kept unchanged |

## EPIC-003: Privacy and per-user isolation

Each user sees and modifies only their own notes. There is no sharing, collaboration, tags, search or rich text. No specific regulation is applied (general industry, no region named) beyond hashed passwords and basic privacy practice.

### US-009: Notes are visible only to their owner

**Priority:** critical

> As a user, I want my notes to be inaccessible to every other user, so that my information stays private.

| ID | Given | When | Then |
|---|---|---|---|
| AC-026 | users A and B each have notes | A opens the Notes list | only A's notes are shown |
| AC-027 | I am signed in as B and know the identifier of one of A's notes | I request, edit or delete it through the API or by URL | the request is refused (not found or forbidden), the note is unchanged and none of its content is revealed |
| AC-028 | I am not signed in | I call any notes API endpoint | the request is rejected as unauthenticated |

### US-010: No sharing or discovery features

**Priority:** low

> As a product owner, I want v1 to exclude sharing, collaboration, tags, search and rich text, so that the product stays simple and private.

| ID | Given | When | Then |
|---|---|---|---|
| AC-029 | the application is released | I review the screens and API | there is no way to share a note, add tags, search notes or format text beyond plain text |

## EPIC-004: Responsive web interface

The three screens (Login with sign-up, Notes list, Note editor) work on phones and desktops.

### US-011: Use the app on phone and desktop

**Priority:** high

> As a user, I want all three screens to adapt to my screen size, so that I can use the app on any device.

| ID | Given | When | Then |
|---|---|---|---|
| AC-030 | a phone-width viewport (about 360 px) | I use Login, Notes list and Note editor | content fits without horizontal scrolling and all controls are reachable and usable by touch |
| AC-031 | a desktop-width viewport | I use the same screens | the layout uses the space sensibly and remains readable |
| AC-032 | any screen size | I use the three screens | the app provides only these three screens: Login (with sign-up), Notes list and Note editor |

## EPIC-005: Notes and accounts API and storage

A server-side API provides account and notes operations, backed by a PostgreSQL relational database. The earlier understanding mentioned SQLite or Postgres; the chosen scope specifies PostgreSQL, so PostgreSQL is used (stack to be confirmed on the stack screen). No external services, API keys or payments. Sized for hundreds of users; no deadline stated.

### US-012: Accounts and notes API

**Priority:** critical

> As a web client, I want an API to register, sign in, sign out and to list, create, read, update and delete the current user's notes, so that the screens can work with real data.

| ID | Given | When | Then |
|---|---|---|---|
| AC-033 | a valid request | the client calls an accounts or notes operation | the API performs it and returns a success response with the data needed by the screen |
| AC-034 | an invalid request (bad input, missing note, unauthenticated) | the client calls the API | it returns an appropriate error status and a clear message without exposing internal details |
| AC-035 | a signed-in user | the notes list is requested | the API returns only that user's notes ordered by last-updated, newest first |

### US-013: Persist users and notes in PostgreSQL

**Priority:** high

> As a product owner, I want users and notes stored in a PostgreSQL database, so that data survives restarts and is consistent.

| ID | Given | When | Then |
|---|---|---|---|
| AC-036 | a user has created notes | the server is restarted | the user can sign in and all their notes are still present with titles, text and updated times |
| AC-037 | the database holds users and notes | its structure is inspected | each note belongs to exactly one user and email addresses are unique per account |
| AC-038 | about a few hundred users each with a modest number of notes | they use the app normally | the Notes list and note saves respond without noticeable delay |

### US-014: No external services needed

**Priority:** medium

> As a product owner, I want the app to run without third-party services, payments or API keys, so that setup and running costs stay minimal.

| ID | Given | When | Then |
|---|---|---|---|
| AC-039 | a fresh environment with only the app and its database | I run the app | every feature works with no email provider, payment provider or other external credential |

## EPIC-006: Setup and usage documentation

Basic documentation for running and using the app.

### US-015: Basic setup and usage guide

**Priority:** medium

> As a developer or operator, I want short documentation covering setup and use, so that I can run the app and understand what it does.

| ID | Given | When | Then |
|---|---|---|---|
| AC-040 | a new developer with the repository and a PostgreSQL instance | they follow the setup instructions | they can configure the database connection, start the app and reach the Login screen |
| AC-041 | the documentation | a user reads the usage section | it explains how to register, sign in, create, edit and delete notes, and sign out, and lists v1 limits (no email verification, password reset, social login, sharing, tags or search) |
<!-- sdlc:auto:end epics -->
