# ESG Backend

This backend is a modular Django REST scaffold for the emissions review product.

## Stack

- Django 5
- Django REST Framework
- Tenant-aware custom user model
- Modular app layout for ingestion, normalization, review, audit, and reporting

## Setup

1. Create a virtual environment.
2. Install dependencies with `pip install -r requirements.txt`.
3. Copy `.env.example` to `.env` and adjust values.
4. Run `python manage.py migrate`.
5. Create a superuser with `python manage.py createsuperuser`.
6. Start the server with `python manage.py runserver`.

## Current endpoints

- `GET /api/health/`
- `GET /admin/`
