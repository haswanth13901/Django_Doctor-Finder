# Django Doctor Finder

A full-stack doctor search application built with Django REST Framework and Next.js. The project includes a backend API with FHIR-compatible doctor data, JWT authentication, and a responsive frontend for login, search, filtering, pagination, and doctor detail views.

## Key Features

- **Doctor search and filtering**
  - Search by name, specialization, city, state, and zip code
  - Sort results alphabetically ascending or descending
  - Pagination with 12 doctors per page
- **JWT-based authentication**
  - Login with Django REST Framework Simple JWT
  - Protected frontend requests with access and refresh token handling
- **FHIR practitioner support**
  - Backend doctor detail endpoint returns a simplified FHIR `Practitioner` representation
  - Model-level FHIR conversion available via `Doctor.to_fhir()` and serializer logic
- **Full-stack separation**
  - Backend: Django + DRF + PostgreSQL + Celery-ready settings
  - Frontend: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Data import support**
  - Django management command for loading external PostgreSQL doctor data

## Project Structure

- `requirements.txt` — Python backend dependencies
- `healthcare-app/backend/` — Django backend application
  - `manage.py` — Django CLI entry point
  - `backend/` — Django project settings and URL configuration
  - `fhirapi/` — app containing models, serializers, views, and routes
  - `db.sqlite3` — local SQLite file present in repo, but backend defaults to PostgreSQL in settings
  - `Data/` — raw and filtered CSV source data for doctors (local-only, ignored by Git)
- `healthcare-app/frontend/` — Next.js frontend application
  - `src/app/` — route pages for login, home, and doctor profile
  - `src/utils/` — frontend auth and API helpers
  - `public/images/` — static assets used by the UI
- `healthcare-app/backend/nest_backend/` — separate NestJS skeleton not used by the main Django/Next.js stack

## Backend Details

### Main backend functionality

- `Doctor` model with fields for practitioner ID, name, specialty, contact, and location
- REST API endpoints:
  - `GET /api/` — root API list
  - `POST /api/create/` — create a new doctor record
  - `GET /api/doctors/` — return all doctors
  - `GET /api/doctors/filter/` — filtered doctor list with pagination
  - `GET /api/doctor/<id>/` — doctor profile in FHIR format
- Authentication endpoints:
  - `POST /api/token/` — obtain JWT access and refresh tokens
  - `POST /api/token/refresh/` — refresh JWT access token

### Import command

- `python backend/manage.py load_external_doctors_postgre`
  - Imports doctor records from an existing PostgreSQL `doctors` table into the Django model

### Backend settings notes

- Default backend settings use PostgreSQL:
  - `NAME=doctor_finder`
  - `USER=postgres`
  - `PASSWORD=Haswanth@13`
  - `HOST=localhost`
  - `PORT=5432`
- `CORS_ALLOWED_ORIGINS` includes local development origins and example production hostnames
- `DEBUG=True` and the secret key are hardcoded for development only
- Celery broker URL is configured for `redis://localhost:6379/0` but Celery tasks are not currently used by the frontend

## Frontend Details

### Pages

- `/login` — user login page
- `/home` — doctor list with filters, search, sort, and pagination
- `/doctor/[practitioner_id]` — doctor detail profile page
- `/` — redirects to `/login`

### Frontend behavior

- Uses local storage for JWT tokens (`access_token` and `refresh_token`)
- Requests the backend via `http://127.0.0.1:8000`
- Automatically refreshes the access token if a protected request returns `401`
- Displays doctor cards and allows clicking through to detailed FHIR-style doctor profiles

## Setup Instructions

### Backend

1. Create and activate a Python virtual environment

```powershell
cd "D:\My Projects\Django Doctor Finder\healthcare-app\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install Python dependencies

```powershell
pip install -r ..\..\requirements.txt
```

3. Download and preprocess the raw dataset

- Download the raw CSV from the CMS provider data catalog: https://data.cms.gov/provider-data/dataset/mj5m-pzi6
- Save the raw file as `healthcare-app/Data/RawData_DAC_NationalDownloadableFile.csv`
- From `healthcare-app/backend`, run:

```powershell
python backend/preprocessing.py
```

  - This script uses `healthcare-app/backend/backend/preprocessing.py` to convert the raw input into `filtered_doctors.csv`.

4. Configure the database

- The default is PostgreSQL. Update `backend/backend/settings.py` if you want to use SQLite or custom credentials.

5. Run migrations

```powershell
python manage.py migrate
```

5. Create a superuser

```powershell
python manage.py createsuperuser
```

6. Start the backend server

```powershell
python manage.py runserver
```

### Frontend

1. Install frontend dependencies

```powershell
cd "D:\My Projects\Django Doctor Finder\healthcare-app\frontend"
npm install
```

2. Start the Next.js development server

```powershell
npm run dev
```

3. Open the app in your browser

- Frontend: `http://localhost:3000`
- Backend: `http://127.0.0.1:8000`

## How to Run

### Start backend and frontend together

1. Open one terminal and start the Django backend:

```powershell
cd "D:\My Projects\Django Doctor Finder\healthcare-app\backend"
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

2. Open a second terminal and start the frontend:

```powershell
cd "D:\My Projects\Django Doctor Finder\healthcare-app\frontend"
npm install
npm run dev
```

3. Visit the frontend at `http://localhost:3000` and use the app.

## Known Limitations

- The app is configured for local development only.
- Credentials and `SECRET_KEY` are stored in source code.
- No registration page or user management UI is included.
- The frontend is tightly coupled to the local API URL and JWT auth flow.
- The backend currently relies on PostgreSQL by default even though `db.sqlite3` exists.
- `navbar`, `forgot password`, and production-grade error handling are not implemented.
- `healthcare-app/backend/nest_backend` is a separate sample module and is not integrated into the main Django/Next.js flow.

## Future Improvements

- Add a registration flow, profile management, and logout handling inside the UI
- Improve authentication with proper token refresh flows and protected route guards
- Support environment variables for secrets, database config, and API endpoints
- Add doctor creation/edit forms in the frontend and validate input client-side
- Harden security for production deployment (HTTPS, secure cookies, CSRF protection, input sanitization)
- Add unit tests, integration tests, and end-to-end test coverage for both backend and frontend
- Add logging, monitoring, and error reporting for production readiness
- Add a separate admin dashboard or user roles for doctor management
- Make the backend database configuration fully compatible with SQLite and PostgreSQL via environment settings
- Improve frontend UX with a better navigation menu, mobile responsiveness, and error states
- Expose FHIR endpoints more fully and support additional FHIR resources such as `Patient` and `Appointment`

## Notes

- The `healthcare-app/Data/` directory contains `filtered_doctors.csv` and `RawData_DAC_NationalDownloadableFile.csv` as local source data assets; this folder is ignored by Git.
- The frontend is built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Axios.
- The backend uses Django 5.2, Django REST Framework, Simple JWT, and FHIR resource support.

---

If you want, I can also add a simple `.env` example and a cleanup section for your README.