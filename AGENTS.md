# AGENTS

Lightweight onboarding for coding agents in this repository.

## Source Of Truth

- Start with [README.md](README.md) for architecture, environment variables, and CI/CD.
- Use [CLAUDE.md](CLAUDE.md) for deeper implementation details and auth/session behavior.
- Keep this file short; link to docs instead of duplicating long guidance.

## Quick Start

1. Backend setup and run:

```bash
cd backend
uv sync
uv run python app.py
```

1. Frontend setup and run:

```bash
cd frontend
npm install
npm run dev
```

1. Validation commands:

```bash
cd frontend && npm run lint
cd frontend && npm run test
cd frontend && npm run build
```

## High-Value Facts For Agents

- Monorepo with two apps: Flask backend in [backend](backend), React + Vite frontend in [frontend](frontend).
- Backend API is under /api/\* and defaults to port 8021.
- Frontend dev server runs on port 8080 and proxies /api/\* and /uploads/\* to backend.
- Backend uses direct PyMongo (no ORM) and stores runtime uploads in [backend/uploads](backend/uploads).
- Frontend auth state is stored in localStorage (student and admin sessions), no JWT.

## Common Pitfalls

- Do not break API prefixing (/api/*) when adding backend routes.
- Keep upload serving behavior compatible with existing /uploads paths.
- Backend has no committed automated tests; include manual verification notes for backend changes.
- Do not commit secrets or generated artifacts (.env, node_modules, dist, .venv, uploads content).

## Code Conventions

- Python: 4-space indentation, snake_case modules, route-focused files in [backend/routes](backend/routes).
- Frontend: PascalCase components/pages, camelCase hooks/services, Tailwind utility classes.
- Follow existing style in touched files; avoid unrelated reformatting.

## Where To Look First

- Routing and guards: [frontend/src/App.tsx](frontend/src/App.tsx)
- Frontend API wrappers: [frontend/src/services/api.ts](frontend/src/services/api.ts)
- Backend entry and blueprint registration: [backend/app.py](backend/app.py)
- Complaint workflow/status handling: [backend/routes/complaints.py](backend/routes/complaints.py)

## Change Expectations

- Keep changes scoped and minimal.
- Update or add frontend tests when frontend behavior changes.
- Use conventional commit style when requested: feat(scope): ..., fix(scope): ..., docs: ...
