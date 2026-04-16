# Repository Guidelines

## Project Structure & Module Organization
This repository is split into two apps:

- `backend/`: Flask API, MongoDB access, and email utilities. Route modules live in `backend/routes/`, data logic in `backend/models/`, shared helpers in `backend/utils/`, and runtime uploads in `backend/uploads/`.
- `frontend/`: React + TypeScript + Vite SPA. Pages live in `frontend/src/pages/`, reusable UI in `frontend/src/components/` and `frontend/src/components/ui/`, layouts in `frontend/src/layout/`, hooks in `frontend/src/hooks/`, and API helpers in `frontend/src/services/`.
- `.github/workflows/`: CI/CD for backend Docker builds, Cloud Run deploys, and Firebase Hosting.

## Build, Test, and Development Commands
Use app-local commands from the relevant directory.

```bash
cd backend && uv sync
cd backend && uv run python app.py
cd backend && docker compose up --build
cd frontend && npm install
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run lint
cd frontend && npm run test
```

`uv run python app.py` starts the Flask API on port `8021` by default. `npm run dev` starts the frontend, `npm run build` creates the production bundle, `npm run lint` runs ESLint, and `npm run test` runs Vitest once.

## Coding Style & Naming Conventions
Follow existing project style instead of reformatting unrelated files. Python uses 4-space indentation, snake_case modules, and small route-focused files. Frontend code uses TypeScript, PascalCase for components/pages (`StudentDashboard.tsx`), camelCase for hooks/services (`use-toast.ts`, `api.ts`), and utility-first Tailwind classes. Use the configured ESLint rules in `frontend/eslint.config.js`; there is no separate Prettier setup in this repo.

## Testing Guidelines
Frontend tests use Vitest with Testing Library and setup from `frontend/src/test/setup.ts`. Place tests next to the feature or under `frontend/src/test/` using `*.test.ts` or `*.test.tsx`. Add or update tests for UI behavior and API-facing logic when changing the frontend. The backend currently has no committed automated test suite, so document manual verification steps in your PR when backend behavior changes.

## Commit & Pull Request Guidelines
Git history uses Conventional Commits such as `feat(backend): ...`, `chore(frontend): ...`, and `docs: ...`. Keep messages lowercase and scoped when helpful. PRs should include a short summary, linked issue or task, affected areas (`backend`, `frontend`, or both), and screenshots for visible frontend changes. Call out any new environment variables, migrations, or deployment impact.

## Security & Configuration Tips
Do not commit `.env` files, credentials, MongoDB URIs, or generated folders such as `frontend/dist/`, `frontend/node_modules/`, and `backend/.venv/`. Prefer `VITE_API_URL` for local frontend API configuration instead of relying on proxy defaults.
