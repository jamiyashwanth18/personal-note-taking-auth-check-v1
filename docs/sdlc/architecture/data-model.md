# Data Model

<!-- sdlc:auto:start entities -->
### users

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| email | varchar(320) UNIQUE, stored lowercased | False | — | False |
| password_hash | varchar(255) Argon2id | False | — | False |
| created_at | timestamptz | False | — | False |

### notes

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| title | varchar(200) | False | — | False |
| body | text | False | — | False |
| created_at | timestamptz | False | — | False |
| updated_at | timestamptz | False | — | False |

### sessions

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| token_hash | char(64) UNIQUE sha256 hex | False | — | False |
| created_at | timestamptz | False | — | False |
| expires_at | timestamptz | False | — | False |
| revoked_at | timestamptz | False | — | True |
<!-- sdlc:auto:end entities -->

<!-- sdlc:auto:start relationships -->
| Source | Target | Type |
|---|---|---|
| users | notes | one-to-many |
| users | sessions | one-to-many |
<!-- sdlc:auto:end relationships -->

<!-- sdlc:auto:start er-diagram -->
```mermaid
erDiagram
  users {
    uuid id PK
    varchar_320__UNIQUE__stored_lowercased email
    varchar_255__Argon2id password_hash
    timestamptz created_at
  }
  notes {
    uuid id PK
    uuid user_id FK
    varchar_200_ title
    text body
    timestamptz created_at
    timestamptz updated_at
  }
  sessions {
    uuid id PK
    uuid user_id FK
    char_64__UNIQUE_sha256_hex token_hash
    timestamptz created_at
    timestamptz expires_at
    timestamptz revoked_at
  }
  users ||--o{ notes : "one-to-many"
  users ||--o{ sessions : "one-to-many"
```
<!-- sdlc:auto:end er-diagram -->
