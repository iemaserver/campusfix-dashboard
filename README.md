# CampusFix

A campus complaint management system for UEM and IEM students. Students submit infrastructure/facility complaints, admins triage and assign them to authorities, and email notifications are sent at each status transition.

## Architecture

```
campusfix-dashboard/
├── backend/      # Flask REST API + MongoDB
└── frontend/     # React + TypeScript + Vite SPA
```

**Backend** (Python/Flask) exposes a REST API under `/campusfix/api/` and serves uploaded files at `/campusfix/uploads/<filename>`. It uses MongoDB for persistence and sends transactional emails via SMTP (Outlook/Office365). Deployed as a Docker container on **Google Cloud Run**.

**Frontend** (React/TypeScript/Vite) is a SPA with role-based routing for students, admins, and clerks. Deployed to **Firebase Hosting**; all routes rewrite to `index.html`.

### User roles

| Role | Login method |
|------|-------------|
| Student | Email/password, OTP (email), or Microsoft SSO — restricted to `@uem.edu.in` / `@iem.edu.in` |
| Admin | Email/password credentials configured in `.env` |
| Clerk | Handled by the clerk-tasks page |

### Backend route modules

- `routes/auth.py` — student register/login (email+password & OTP), Microsoft SSO, admin login
- `routes/complaints.py` — CRUD for complaints, status updates, assignment, accept/reopen
- `routes/admin.py` — admin-scoped complaint views
- `routes/dashboard.py` — aggregate stats
- `routes/authorities.py` — manage authority contacts per complaint category

## Backend setup

Requires Python ≥ 3.11 and [uv](https://github.com/astral-sh/uv).

```bash
cd backend
cp .env.example .env   # fill in values (see Environment variables below)
uv sync
uv run python app.py   # dev server on port 8021
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `DB_NAME` | Database name (default: `campusfix`) |
| `FLASK_DEBUG` | `true` / `false` |
| `PORT` | Server port (default: `8021`) |
| `OUTLOOK_HOST` | SMTP host (default: `smtp.office365.com`) |
| `OUTLOOK_PORT` | SMTP port (default: `587`) |
| `OUTLOOK_EMAIL` | SMTP sender address |
| `OUTLOOK_PASSWORD` | SMTP password |
| `ADMIN_1_EMAIL` | First admin email (repeat with `ADMIN_2_`, `ADMIN_3_`, … for multiple admins) |
| `ADMIN_1_PASSWORD` | First admin password |
| `ADMIN_1_NAME` | First admin display name |
| `MICROSOFT_CLIENT_ID` | Azure AD app client ID for Microsoft SSO |

### Docker (local)

```bash
cd backend
docker compose up --build
```

Starts Flask on port `8021` and MongoDB on `27017`.

## Frontend setup

Requires Node.js and npm.

```bash
cd frontend
npm install
```

Set `VITE_API_URL` in a `.env` file (defaults to `http://localhost:8021/api` if unset):

```env
VITE_API_URL=http://localhost:8021/campusfix/api
```

```bash
npm run dev        # dev server on port 8080 (proxies /api → localhost:8000)
npm run build      # production build to dist/
npm run lint       # ESLint
npm run test       # Vitest (single run)
npm run test:watch # Vitest (watch mode)
```

> **Note:** The Vite dev proxy targets `localhost:8000`, but the backend runs on `8021` by default. Override with `VITE_API_URL` rather than relying on the proxy in local dev.

## CI/CD

| Workflow | Trigger | Action |
|----------|---------|--------|
| `backend-docker.yml` | Push to `main` | Builds and pushes Docker image to GHCR |
| `backend-deploy.yml` | After `backend-docker.yml` succeeds (or `workflow_dispatch`) | Deploys image to Cloud Run (`campusfix-backend`, `us-central1`) |
| `firebase-hosting-merge.yml` | Push to `main` | Deploys frontend to Firebase Hosting (production) |
| `firebase-hosting-pull-request.yml` | Pull request | Deploys preview channel to Firebase Hosting |

Required GitHub secrets: `GCP_SA_KEY`, `MONGO_URI`, `DB_NAME`, `FLASK_DEBUG`, `OUTLOOK_*`, `ADMIN_1_*`, `MICROSOFT_CLIENT_ID`.
