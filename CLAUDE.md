# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Talent Acquisition (TA) management system with a Django REST API backend and React/Vite frontend. It manages job requirements, candidate submissions, placements, and dashboards for recruiters, sourcers, and clients. The backend integrates with the Ceipal API for external job/submission data.

## Commands

### Backend
```bash
cd Back_end_API
source venv/bin/activate
cd api
export DJANGO_ENV=development
python manage.py runserver          # Start dev server (port 8000)
python manage.py makemigrations ta_team && python manage.py migrate
python manage.py test               # Run tests
```

### Frontend
```bash
cd Front_end/ta_team_front/front_end
npm run dev                         # Dev server (port 5173)
npm run build                       # Production build
npm run lint                        # ESLint check
```

### Environment
- Backend reads `.env.development` or `.env.production` based on `DJANGO_ENV`
- Frontend uses `VITE_API_BASE_URL=http://127.0.0.1:8000` (dev) or `/api` (prod)

## Architecture

### Backend (`Back_end_API/api/`)
- `api/` — Django project root: settings, JWT auth (`auth.py`), permissions, root URLs
- `ta_team/` — Core app with models, views (ViewSets), serializers, filters
- `ceipal/` — Ceipal API client, token management, synced models

**Authentication:** Azure AD JWT validation via JWKS caching. Frontend obtains tokens via Azure MSAL, sends as `Bearer` header. Backend validates via `AzureADJWTAuthentication`.

**RBAC:** `RolePermission` model links Designation → Module → Permission Type. Permission classes (e.g., `RequirementsPermission`, `SubmissionsPermission`) check against this. Endpoint: `GET /ta_team/role-permissions/?id=<designation_id>`.

**Model split:** Models are split by domain into separate files and re-exported via `ta_team/models/__init__.py`:
- `models.py` — Account, Client, Employee, Designation, Status lookup tables
- `requirement.py` — Requirements model
- `submission.py` — Submissions, Placement; status is auto-calculated in `save()`

**Key patterns:**
- Import shared models in related model files via `from models.models import *`
- Add `db_index=True` on frequently filtered fields
- Raise `CeipalAuthenticationError` for Ceipal API failures

### Frontend (`Front_end/ta_team_front/front_end/src/`)
- `components/` — Page components (RequirementForm, AllSubmissions, dashboards, etc.)
- `redux/slices/` — `authSlice` (user + auth state), `dropdownSlice` (master data cached with redux-persist)
- `services/` — Axios instance, `drop_downService.js` for master data, auth utilities

**Auth flow:** Azure MSAL `loginPopup()` → `acquireTokenSilent()` → POST `/api/login/` → store employee details in Redux.

**State:** Redux Toolkit + redux-persist (localStorage key `root`). Dropdown/master data is loaded once and persisted.

### API Routes
- `/ta_team/` — All core ViewSets (Requirements, Submissions, Clients, Employees, RBAC, Dashboards)
- `/ceipal/` — Ceipal-proxied endpoints
- `/api/login/` — Validate Azure token, return employee details
- `/api/token/refresh/` — JWT refresh

### Frontend Routes (React Router)
`/addrequirements`, `/submissions`, `/filledjob`, `/allreqs/:empcode`, `/allsubmissions/:empcode`, `/submissionsDateEntry`, `/submissionsDateDetails`, `/recruiterdashboard`, `/sourcerdashboard`, `/clientdashboard`, `/myprofile`

## Adding New Features

**New TA entity:**
1. Create model in the appropriate file under `ta_team/models/`, export via `__init__.py`
2. Add DRF serializer in `ta_team/serializers.py`
3. Add ViewSet in `ta_team/views.py`, register router in `ta_team/urls.py`
4. Register in `admin_interface/admin.py` if needed

**New Ceipal integration:** Extend `CeipalClient` class in `ceipal/ceipal_client.py`.

**Frontend feature:** Add Redux slice if new state is needed; connect via `react-redux`; add route in `App.jsx`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) deploys `master` branch pushes to EC2 via SSH: runs migrations, collectstatic, npm build, then restarts gunicorn + nginx.
