# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `bc6fa51` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
Personal note taking - auth check v1 is a personal notes app. Users sign in with email and password, then list, create, edit and delete their own notes. The repository holds two applications. `backend/` is a FastAPI 0.115 service on PostgreSQL 16 using SQLAlchemy 2.0 and Alembic. It provides `/health`, `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me` and CRUD under `/notes`. Notes are scoped to their owner. Sessions are opaque Bearer tokens stored as SHA-256 hashes, and passwords are hashed with argon2. On startup the backend runs Alembic migrations to head and seeds a bootstrap admin. `frontend/` is a Vite 6 + React 19 + Tailwind 4 single-page app with three screens: Login, Notes list and Note editor. The screens still render seeded sample data. `src/lib/api.ts` provides `apiFetch` and session-token helpers for wiring them to the real API. A GitHub Actions workflow builds and pushes the backend image to ECR and publishes the frontend to AWS Amplify on every push to `main`.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Python 3.12 (the backend Dockerfile uses python:3.12-slim)
- Node.js with npm (for the Vite/React frontend)
- Docker with Compose, to run the local PostgreSQL 16 database from docker-compose.yml (or another reachable PostgreSQL 16)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. docker compose up -d db
2. cd backend
3. pip install -r requirements.txt
4. uvicorn app.main:app --reload   # runs Alembic migrations to head on startup; DATABASE_URL defaults to postgresql+psycopg://app:app@localhost:5432/app
5. cd ../frontend
6. npm install
7. npm run dev   # the frontend calls VITE_API_BASE_URL, falling back to http://localhost:8000
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| db | `docker compose up -d db` | Starts PostgreSQL 16 (user/password/db: app) on port 5432 with a persistent volume. |
| api | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service with auto-reload on port 8000. Applies migrations and seeds the bootstrap admin on startup. |
| api (container) | `docker build -t notes-api ./backend && docker run -p 8000:8000 -e DATABASE_URL=postgresql+psycopg://app:app@host.docker.internal:5432/app notes-api` | Builds and runs the backend image as in the Dockerfile (uvicorn on 0.0.0.0:8000, healthcheck on /health). |
| dev | `cd frontend && npm run dev` | Starts the Vite dev server for the React SPA. |
| build | `cd frontend && npm run build` | Bundles the frontend into dist/. This does not typecheck. |
| preview | `cd frontend && npm run preview` | Serves the production build locally. |
| format | `cd frontend && npm run format` | Formats the frontend with Prettier. |
| format (backend) | `cd backend && ruff format .` | Formats the backend with Ruff. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container configuration (devcontainer.json). |
| `.github/` | GitHub configuration. |
| `.github/workflows/` | deploy.yml: on push to main, builds and pushes the backend image to ECR and deploys the frontend build to AWS Amplify using OIDC. |
| `.quorq/` | Quorq platform metadata (handoff.json, prepared.json). |
| `backend/` | FastAPI service: Dockerfile, requirements.txt, alembic.ini, pytest.ini, ruff.toml. |
| `backend/app/` | Application code: main.py (app, CORS, error handlers, lifespan), config.py, database.py (engine/session/get_db), deps.py (get_current_user), models.py, schemas.py, migrate.py, seed.py and routers/ (auth.py, notes.py). |
| `backend/migrations/` | Alembic environment and versioned migrations (0001 initial, 0002 session last_seen indexes, 0003 lowercase unique email). |
| `backend/scripts/` | Utility scripts (check_connections.py). |
| `backend/tests/` | Pytest suite: conftest.py, auth API, health and seed tests. |
| `frontend/` | Vite + React SPA: package.json, vite.config.ts, tsconfig.json, ESLint/Prettier/Playwright config. |
| `frontend/e2e/` | Playwright end-to-end specs. |
| `frontend/src/` | App source: main.tsx, App.tsx (route table and side-menu shell), screens/ (Login, Notes, NoteEditor), lib/ (api.ts, ui.tsx, icons.tsx, brand.ts, navigate.ts), index.css, Vitest setup and tests. |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend: one APIRouter per resource with a path prefix and tags (`/auth`, `/notes`), included in main.py.
- Backend: dependencies are injected via `Annotated` aliases (`Db = Annotated[Session, Depends(get_db)]`, `CurrentUser = Annotated[User, Depends(get_current_user)]`).
- Schema changes go through Alembic migrations only, never `create_all`. Migrations run automatically at startup in the lifespan hook.
- Auth uses opaque Bearer tokens in the `Authorization` header, not cookies. Only the SHA-256 hash of a token is stored, and logout sets `revoked_at`. Passwords are hashed with argon2, with a dummy-hash verify for unknown emails.
- Emails are normalised to lowercase in both the router and the model validator.
- Notes are owner-scoped. Missing, malformed and not-owned ids all return 404 'Note not found'.
- The API field `text` maps to the `body` column on the Note model.
- Error shapes: HTTP errors return `{detail: message}`, validation errors return 422 with `{detail: [{field, message}]}`, and unhandled errors return 500 `{detail: 'Something went wrong'}`.
- Frontend: the `@/` import alias maps to `src/`. There is one module per screen in `src/screens/`. Brand tokens are CSS variables (`var(--brand-*)`) used with Tailwind classes.
- Frontend API calls should go through `apiFetch` in `src/lib/api.ts`. It joins paths to `VITE_API_BASE_URL` with a single slash and sends the stored session token (or `VITE_API_SECRET_KEY`) as the Bearer.
- Vitest component tests live beside components under `src/`. Playwright specs live in `e2e/`.
- Linting and formatting: Ruff for Python, ESLint + Prettier for the frontend. `npm run lint` is a platform gate and should stay green.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite in backend/tests (pytest.ini sets pythonpath and testpaths). |
| backend lint | `cd backend && ruff check .` | Lints the backend with Ruff. |
| frontend unit | `cd frontend && npm test` | Runs Vitest component tests under src/ in jsdom. |
| typecheck | `cd frontend && npm run typecheck` | Runs `tsc --noEmit`. The build does not do this. |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend. Use `npm run lint:fix` to auto-fix. |
| format check | `cd frontend && npm run format:check` | Checks Prettier formatting without writing. |
| e2e browser install | `cd frontend && npm run test:e2e:install` | Installs Playwright's Chromium. |
| e2e | `cd frontend && npm run test:e2e` | Runs the Playwright specs in e2e/. Without E2E_BASE_URL, it boots the backend from backend/.venv on port 8000 and a built preview on port 4173. With E2E_BASE_URL set, it targets that URL instead. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| The backend fails on startup with a database connection error. | Migrations run in the startup hook, so PostgreSQL must be reachable. Run `docker compose up -d db`, or set DATABASE_URL to a postgresql+psycopg:// URL for your server. |
| Browser calls from the frontend to the API are blocked by CORS. | The API only allows origins listed in ALLOWED_ORIGINS (comma separated, read in app/config.py). Include your frontend's origin. |
| `npm run test:e2e` cannot start the backend. | The Playwright webServer runs `../backend/.venv/bin/python -m uvicorn ...`. Create a virtualenv at backend/.venv, install requirements.txt into it, and make sure DATABASE_URL points to a running PostgreSQL. |
| `pytest` cannot import `app`. | Run pytest from the backend/ directory so pytest.ini's `pythonpath = .` applies. |
| The build succeeds but deployment or typechecking fails on type errors. | `npm run build` does not typecheck. Run `npm run typecheck` and fix the reported errors. |
| The frontend screens don't show real data after logging in. | This is expected: the screens still render seeded sample data. Wire them to the API with `apiFetch`, and store the token from `/auth/login` with `setSessionToken`. |
| Chromium crashes in Docker during the e2e tests. | The Playwright config already passes `--disable-dev-shm-usage`. If crashes persist, raise the container's /dev/shm size. |
| The deploy workflow commits a plain-text API secret. | deploy.yml sets VITE_API_SECRET_KEY and NEXT_PUBLIC_API_SECRET_KEY literally, and Vite inlines VITE_* values into the public bundle. Treat that value as exposed: rotate it and move it to a GitHub secret, or remove the shared-secret fallback. |
<!-- sdlc:auto:end troubleshooting -->
