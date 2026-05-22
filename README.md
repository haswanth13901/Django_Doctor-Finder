# Django Doctor Finder

_A modern doctor search platform that combines FHIR-compatible provider data with a fast Next.js frontend and Django REST API._

![Build Status](https://img.shields.io/badge/build-pending-lightgrey.svg)
![License](https://img.shields.io/badge/license-UNLICENSED-yellow.svg)
![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)

![Project Demo](docs/demo-placeholder.gif)

## About the Project

Django Doctor Finder solves the fragmentation of provider data by providing a searchable, filtered, and paginated doctor directory powered by FHIR-style healthcare data. It is designed as a developer-first full-stack example that demonstrates how Django REST Framework, JWT authentication, and Next.js can collaborate to deliver a modern healthcare search experience.

The project is motivated by the need for a clean integration between clinical data structures and user-facing search workflows, making it easier to build patient-facing or administrative doctor lookup services.

## Built With

- Python 3.12
- Django 5.2
- Django REST Framework
- djangorestframework-simplejwt
- Celery
- Redis
- PostgreSQL
- pandas
- `fhir.resources`
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios

## Getting Started

### Prerequisites

- Python 3.12
- Node.js 20+
- npm 10+
- PostgreSQL
- Redis

### Local Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd "D:\My Projects\Django Doctor Finder"
```

2. Create and activate the backend virtual environment:

```powershell
cd healthcare-app/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install backend dependencies:

```powershell
pip install -r ..\..\requirements.txt
```

4. Configure the database in `healthcare-app/backend/backend/settings.py` if needed.

5. Run backend migrations:

```powershell
python manage.py migrate
```

6. Create a Django superuser:

```powershell
python manage.py createsuperuser
```

7. Start the backend server:

```powershell
python manage.py runserver
```

### Frontend Setup

1. Install frontend dependencies:

```powershell
cd healthcare-app/frontend
npm install
```

2. Start the frontend server:

```powershell
npm run dev
```

3. Open the app in your browser:

- Frontend: `http://localhost:3000`
- Backend: `http://127.0.0.1:8000`

## Usage

### API Endpoints

- `GET /api/` — API root endpoint
- `POST /api/token/` — acquire JWT access and refresh tokens
- `POST /api/token/refresh/` — refresh an access token
- `GET /api/doctors/` — retrieve all doctors
- `GET /api/doctors/filter/` — search and paginate doctor results
- `GET /api/doctor/<id>/` — retrieve doctor details in FHIR format

### Example: Fetch Doctors

```js
import axios from 'axios';

const response = await axios.get('http://127.0.0.1:8000/api/doctors/');
console.log(response.data);
```

### Example: Authentication + Protected Request

```js
const tokenResponse = await axios.post('http://127.0.0.1:8000/api/token/', {
  username: 'admin',
  password: 'password',
});

const doctorsResponse = await axios.get('http://127.0.0.1:8000/api/doctors/', {
  headers: { Authorization: `Bearer ${tokenResponse.data.access}` },
});
```

## Roadmap

- Add support for environment configuration via `.env` files.
- Harden production readiness with HTTPS, secure cookies, CSRF protection, and sanitized inputs.
- Introduce user registration and profile management.
- Expand frontend UI for better mobile responsiveness and navigation.
- Add test coverage for backend APIs and frontend components.
- Build out monitoring, logging, and error reporting.
- Extend FHIR support to additional resources like `Patient` and `Appointment`.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add feature or fix bug'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a pull request.

