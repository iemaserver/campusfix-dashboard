# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CampusFix is a campus complaint management system for UEM/IEM students. Students submit infrastructure complaints, admins triage and assign them to authorities, and email/SMS notifications are sent at each status transition.

**Deployment**: Backend on Google Cloud Run, frontend on Firebase Hosting.

## Development Commands

### Backend (Flask + MongoDB)

```bash
cd backend
cp .env.example .env        # First time only
uv sync                     # Install Python dependencies
uv run python app.py        # Dev server on port 8021

# Or with Docker (includes MongoDB):
docker compose up --build
```

### Frontend (React + Vite)

```bash
cd frontend
npm install                 # First time only
npm run dev                 # Dev server on port 8080 (proxies /api/* to :8021)
npm run build               # Production build to dist/
npm run lint                # ESLint
npm run test                # Vitest single run
npm run test:watch          # Vitest watch mode
```

## Architecture

### Backend (`backend/`)

Flask app with MongoDB (PyMongo direct — no ORM). Entry point is `app.py`. Routes are split into blueprints under `routes/`:
- `auth.py` — Student (email/password, OTP, Microsoft SSO) and admin login
- `complaints.py` — Full complaint lifecycle (create, status updates, assign, accept, reopen)
- `admin.py` — Admin-scoped complaint listing
- `dashboard.py` — Aggregate stats endpoint
- `authorities.py` — Authority contact CRUD

All endpoints are prefixed with `/api/`. File uploads are stored in `backend/uploads/` and served at `/uploads/<filename>`.

The `utils/email_queue.py` module runs an async worker thread for non-blocking email sends via Outlook SMTP. SMS is optional via Textbee API.

Admin accounts are loaded from environment variables (`ADMIN_1_EMAIL`, `ADMIN_1_PASSWORD`, `ADMIN_1_NAME`, repeatable with `ADMIN_2_`, etc.) — there is no admin registration flow.

### Frontend (`frontend/src/`)

React 18 SPA with Vite. Key structure:
- `App.tsx` — Router with role guards (`RequireStudent`, `RequireAdmin`, `RequireAnyAuth`)
- `pages/` — Route-level components (student and admin views)
- `components/` — Reusable components; `components/ui/` contains shadcn-ui primitives
- `layout/` — `AppLayout.tsx` (shared navbar + outlet)
- `services/api.ts` — All Axios calls; base URL from `VITE_API_URL` env var (default: `http://localhost:8021/api`)
- `hooks/` — Custom React hooks

**State**: TanStack React Query for server state. Auth stored in `localStorage` keys `student_user` (student) and `admin_session` (admin with expiry). No JWT — backend is stateless and trusts email from request body.

**Auth flows**: Students use email/password, OTP, or Microsoft SSO (`@azure/msal-browser`). Email domain restricted to `@uem.edu.in` / `@iem.edu.in` on both frontend and backend.

### Vite Proxy

The frontend dev server proxies `/api/*` and `/uploads/*` to `http://localhost:8021`. No cross-origin config needed locally.

## Key Conventions

- **Commits**: Conventional Commits — `feat(backend): ...`, `fix(frontend): ...`, `docs: ...` (lowercase, scoped)
- **Python**: snake_case, 4-space indent
- **TypeScript/React**: PascalCase for components/pages, camelCase for hooks/services/utilities
- **Testing**: Frontend tests use Vitest + Testing Library, placed next to features or in `src/test/`. Backend has no automated test suite.
- **Styling**: Tailwind CSS + shadcn-ui. Dark mode via `class` attribute. Custom status colors defined in `tailwind.config.ts`.

## Environment Variables

Backend variables documented in `backend/.env.example`. Key ones:
- `MONGO_URI`, `DB_NAME` — MongoDB connection
- `ADMIN_1_EMAIL`, `ADMIN_1_PASSWORD`, `ADMIN_1_NAME` — Admin credentials (repeat for more admins)
- `OUTLOOK_*` — SMTP for email notifications
- `MICROSOFT_CLIENT_ID` — Azure AD for SSO
- `TEXTBEE_API_KEY`, `TEXTBEE_DEVICE_ID` — Optional SMS

Frontend: set `VITE_API_URL` in `frontend/.env` to point to the backend (e.g., production URL).
