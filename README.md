# CARBON.OS - Enterprise ESG Engine

CARBON.OS is a comprehensive, enterprise-grade Environmental, Social, and Governance (ESG) data ingestion and emissions management platform. This system allows multi-tenant organizations to automate the collection, normalization, review, and reporting of their carbon emissions data.

## 🌐 Live Demo

https://cabon-engine.vercel.app/

## 📋 Table of Contents

- [Features](#-features)
- [Architecture & Workflow](#-architecture--workflow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Routes](#-api-routes)

## 🌟 Features

- **Multi-Tenant Architecture**: Strict data isolation using custom middleware and querysets, ensuring tenant-specific data boundaries.
- **Data Ingestion Pipeline**:
  - Automated parsing of SAP, Utility, and Travel CSV extracts.
  - Normalization engine to map custom units (e.g., `kWh`, `tkm`) and link corresponding Emission Factors.
- **Review Queue & Edit Workflow**:
  - A dedicated interface for analysts to review "Pending" or "Suspicious" data rows.
  - Slide-out details drawer with inline editing and Approve/Reject workflows.
- **Audit & Traceability**:
  - Comprehensive tracking of all data mutations. Manual edits to normalized amounts require reasoning notes, which are permanently logged.
- **Dynamic Reporting**:
  - Real-time aggregations of Scope 1, Scope 2, and Scope 3 emissions.
  - Interactive Month-over-Month variance charts generated directly from normalized telemetry.
- **Modern UI**: Fully responsive Dashboard, Sidebar Navigation, and Data Tables styled with TailwindCSS (dark theme).

## 🔄 Architecture & Workflow

The platform follows a structured lifecycle for emission records:
1. **Ingestion**: Upload CSV files via the `/ingestions` hub.
2. **Normalization**: The backend parses the payload and applies tenant-specific mapping rules.
3. **Verification**: Analysts use the `/review` queue to verify, edit, and ultimately approve data.
4. **Ledger Commit**: Approved records flow into the core ledger for real-time aggregation on the `/reports` dashboard.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) via Vite
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: React Hooks & Context
- **Navigation**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Framework**: [Django 5](https://www.djangoproject.com/) + Django REST Framework (DRF)
- **Language**: Python 3.11
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL (via local docker or sqlite for testing)

## 📂 Project Structure

```
.
├── backend/                  # Django REST API backend
│   ├── config/               # Core routing, settings, and WSGI/ASGI
│   ├── apps/
│   │   ├── accounts/         # User auth & multi-tenant models
│   │   ├── audit/            # Action history & audit trails
│   │   ├── ingestion/        # Upload handlers and background processing
│   │   ├── normalization/    # Emission factor application and validation
│   │   ├── reference_data/   # Seeding scripts and master taxonomies
│   │   ├── reporting/        # Dashboard APIs & aggregations (by month/scope)
│   │   └── review/           # Approval/Rejection endpoints for NormalizedRecords
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                 # React UI application
    ├── src/
    │   ├── api/              # Axios interceptors with Bearer tokens
    │   ├── components/       # AppShell sidebar, Detail Drawers, UI atoms
    │   ├── pages/            # Main views (Dashboard, Ingestion, Review, Reports)
    │   ├── App.tsx           # Route provider setup
    │   └── main.tsx
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

## 🚀 Getting Started

### 1. Backend Setup
Navigate to the `backend` directory, create your virtual environment, and install dependencies:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Run migrations and seed the database with initial users and reference data:
```bash
python manage.py migrate
python manage.py seed_users          # Creates test tenants (glc, tim, ere)
python manage.py seed_reference_data # Generates source systems and emission factors
python manage.py runserver
```

### 2. Frontend Setup
In a new terminal window, navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```

### 3. Login
Open `http://localhost:5173`. Use one of the seeded credentials:

**Admins (Full Dashboard Access)**
- **Tenant**: `glc` | **Email**: `admin@glc.com` | **Password**: `Passw0rd!`
- **Tenant**: `tim` | **Email**: `admin@tim.com` | **Password**: `Passw0rd!`

**Analysts (Upload & Review Access)**
- **Tenant**: `glc` | **Email**: `analyst@glc.com` | **Password**: `Passw0rd!`
- **Tenant**: `tim` | **Email**: `analyst@tim.com` | **Password**: `Passw0rd!`

## 📝 API Routes (Base: `/api`)

- **Auth**: `/auth/login/`, `/auth/refresh/`
- **Ingestion**: 
  - `POST /ingestions/upload/`
  - `GET /ingestions/jobs/`
- **Review Queue**: 
  - `GET /records/`
  - `PATCH /records/<uuid>/`
  - `POST /records/<uuid>/approve/`
  - `POST /records/<uuid>/reject/`
- **Reporting**: 
  - `GET /reports/summary/` (returns `totals`, `by_scope`, `by_source`, and `by_month`)
- **Audit**: 
  - `GET /audit/`
  - `GET /audit/NormalizedRecord/<uuid>/`
