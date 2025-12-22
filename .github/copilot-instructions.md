# AI Coding Guidelines for TA Admin Project

## Architecture Overview
This is a Talent Acquisition (TA) management system with a Django REST API backend and React/Vite frontend. The backend integrates with Ceipal API for external job and submission data.

- **Backend Structure**: Django project with two main apps:
  - `ta_team`: Core TA models (Requirements, Submissions, Employees, etc.) in [Back_end_API/api/ta_team/models/](Back_end_API/api/ta_team/models/)
  - `ceipal`: Ceipal API client and token management in [Back_end_API/api/ceipal/](Back_end_API/api/ceipal/)
- **Frontend Structure**: React app using Redux for state, Bootstrap for UI, Azure MSAL for authentication
- **Data Flow**: Frontend calls Django APIs, which may proxy or enrich data from Ceipal API

## Key Patterns
- **Model Organization**: Models split into separate files (e.g., `requirement.py`, `submission.py`) imported via `models/__init__.py`
- **API Integration**: Use `ceipal_client.py` for Ceipal API calls; handle token refresh via `token_management.py`
- **Authentication**: JWT for API auth, Azure Entra for user login; configure in `settings.py`
- **Serialization**: DRF serializers in `ta_team/serializers.py` for API responses
- **State Management**: Redux slices for frontend state; persist with `redux-persist`

## Developer Workflows
- **Backend Setup**: `cd Back_end_API/api && python manage.py runserver` (after activating venv and setting env vars)
- **Frontend Setup**: `cd Front_end/ta_team_front/front_end && npm run dev`
- **Migrations**: `python manage.py makemigrations ta_team && python manage.py migrate`
- **Environment**: Use `.env.development` for local dev; set `DJANGO_ENV=development`
- **Testing**: Run `python manage.py test` for backend; `npm run lint` for frontend

## Conventions
- **Imports**: From `models.models import *` in related models (e.g., [Back_end_API/api/ta_team/models/requirement.py](Back_end_API/api/ta_team/models/requirement.py#L1))
- **Foreign Keys**: Extensive use for relationships; e.g., `Requirements` links to `Client`, `Employee`, etc.
- **Indexes**: Add database indexes on frequently queried fields (see Meta classes)
- **Error Handling**: Raise custom exceptions like `CeipalAuthenticationError` for API failures
- **Status Updates**: Automatic status calculation in model `save()` methods (e.g., [Back_end_API/api/ta_team/models/submission.py](Back_end_API/api/ta_team/models/submission.py#L35))

## Dependencies
- Backend: Django 5.2+, DRF, JWT, CORS, Azure auth, pandas/plotly for analytics
- Frontend: React 19, Vite, Redux Toolkit, Bootstrap, Axios for API calls

## Common Tasks
- Adding new TA entities: Create model in appropriate file, add serializer, update admin.py
- Ceipal integration: Extend `ceipalClient` class with new methods
- Frontend features: Use Redux slices for state, connect via `react-redux`</content>
<parameter name="filePath">/Users/rajkumarg/Projects/TA-Admin-Project/.github/copilot-instructions.md