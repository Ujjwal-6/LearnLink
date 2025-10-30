# LearnLink Setup Guide 🛠️

Complete setup and configuration guide for LearnLink - Academic Resource Sharing Platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Backend Setup (Django)](#backend-setup-django)
4. [Frontend Setup (React)](#frontend-setup-react)
5. [Database Setup](#database-setup)
6. [Authentication Configuration](#authentication-configuration)
7. [API Documentation](#api-documentation)
8. [Troubleshooting](#troubleshooting)
9. [Production Deployment](#production-deployment)

---

## Prerequisites

### Required Software

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Python** 3.9 or higher
- **pip** 21.0 or higher
- **Git** (latest version)

### Optional (for production)
- **PostgreSQL** 14+ (recommended for production)
- **Redis** (for session storage in production)
- **Nginx** (for reverse proxy)

### Check Versions

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
python --version  # Should be 3.9+
pip --version     # Should be 21+
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LearnLink
```

### 2. Install Frontend Dependencies

```bash
npm install
```

This will install all React, TypeScript, and UI dependencies.

### 3. Install Backend Dependencies

```bash
cd backend_django
pip install -r requirements.txt
```

Or use a virtual environment (recommended):

```bash
cd backend_django
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

pip install -r requirements.txt
```

---

## Backend Setup (Django)

### 1. Database Migration

```bash
cd backend_django
python manage.py makemigrations
python manage.py migrate
```

This creates all necessary database tables.

### 2. Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 3. Start Django Server

```bash
# Using the startup script (recommended)
chmod +x start_backend.sh
./start_backend.sh

# Or manually
python manage.py runserver 5001
```

Backend will be available at `http://localhost:5001`

### 4. Verify Backend

Open browser and visit:
- API Health: `http://localhost:5001/api/health`
- Admin Panel: `http://localhost:5001/admin`

Expected health response:
```json
{
  "status": "ok"
}
```

---

## Frontend Setup (React)

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5001/api
```

### 2. Start Development Server

```bash
# From root directory
npm run dev
```

Frontend will be available at `http://localhost:8080`

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 4. Preview Production Build

```bash
npm run preview
```

---

## Database Setup

### Development (SQLite)

SQLite is used by default for development. Database file: `backend_django/db.sqlite3`

**Advantages:**
- Zero configuration
- File-based, portable
- Perfect for development

**Limitations:**
- Not suitable for production
- No concurrent writes
- Limited scalability

### Production (PostgreSQL)

#### 1. Install PostgreSQL

```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Windows
# Download from https://www.postgresql.org/download/
```

#### 2. Create Database

```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE learnlink_db;
CREATE USER learnlink_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE learnlink_db TO learnlink_user;
\q
```

#### 3. Update Django Settings

Edit `backend_django/learnlink_backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'learnlink_db',
        'USER': 'learnlink_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

#### 4. Install PostgreSQL Adapter

```bash
pip install psycopg2-binary
```

#### 5. Run Migrations

```bash
python manage.py migrate
```

---

## Authentication Configuration

### Backend Authentication

The system uses **session-based authentication** with secure tokens.

#### Password Hashing

- Algorithm: SHA-256 (development)
- For production: Consider bcrypt or Argon2

```python
# In backend_django/api/views.py
import hashlib

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()
```

#### Session Storage

- **Development**: In-memory dictionary
- **Production**: Use Redis or database

#### Production Upgrade (Redis Sessions)

```bash
pip install django-redis
```

Update `settings.py`:

```python
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"
```

### Frontend Authentication

#### Auth Context

Located in `src/contexts/AuthContext.tsx`

- Manages user state globally
- Stores token in localStorage
- Auto-restores session on page reload

#### Protected Routes

All app routes (except login/signup) require authentication.

Component: `src/components/ProtectedRoute.tsx`

```typescript
// Automatically redirects to /login if not authenticated
<ProtectedRoute>
  <YourProtectedComponent />
</ProtectedRoute>
```

---

## API Documentation

### Base URL

```
http://localhost:5001/api
```

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "display_name": "John Doe",
  "role": "student",
  "semester": 4,
  "department": "Computer Science"
}
```

**Response:**
```json
{
  "success": true,
  "token": "abc123...",
  "user": {
    "user_id": "a1b2c3",
    "username": "johndoe",
    "email": "john@example.com",
    "display_name": "John Doe",
    "role": "student",
    "semester": 4,
    "department": "Computer Science"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",  // or email
  "password": "password123"
}
```

**Response:** Same as signup

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:** User object

---

### Resource Endpoints

#### Upload Resource
```http
POST /api/resources/upload
Content-Type: multipart/form-data

subject_code: CS101
topic_name: Recursion
resource_type: note
title: Introduction to Recursion
description: Comprehensive notes on recursion
uploaded_by: user_id
file: (binary)
video_url: https://youtube.com/... (optional)
```

**Response:**
```json
{
  "resource_id": "r123",
  "topic_name": "Recursion",
  "subject_code": "CS101",
  "resource_type": "note",
  "title": "Introduction to Recursion",
  "description": "Comprehensive notes on recursion",
  "file_path": "/uploads/recursion-notes.pdf",
  "uploaded_by": {
    "user_id": "u1",
    "username": "johndoe"
  },
  "rating_avg": 0,
  "created_at": "2025-10-30T10:00:00Z"
}
```

#### Get Resources
```http
GET /api/resources?topic_name=Recursion&sort=top
```

**Query Parameters:**
- `topic_name` (optional): Filter by topic
- `sort` (optional): `top` or `recent`

#### Rate Resource
```http
POST /api/resources/{resource_id}/rate
Content-Type: application/json

{
  "rating": 5,
  "user_id": "u1"
}
```

**Response:**
```json
{
  "success": true,
  "new_avg_rating": 4.5,
  "is_new_rating": true,
  "user_rating": 5
}
```

---

### Subject & Topic Endpoints

#### Get All Subjects
```http
GET /api/subjects
```

#### Get Topics
```http
GET /api/topics?subject_code=CS101
```

#### Mark Topic Important
```http
POST /api/topics/important
Content-Type: application/json

{
  "topic_name": "Recursion",
  "subject_code": "CS101",
  "created_by": "u1"
}
```

**Response:**
```json
{
  "success": true,
  "new_importance_score": 5.0,
  "already_marked": false
}
```

#### Get Important Topics
```http
GET /api/topics/important-list
```

---

### Profile Endpoints

#### Get User Profile
```http
GET /api/profile/{user_id}
```

**Response:**
```json
{
  "user_id": "u1",
  "username": "johndoe",
  "display_name": "John Doe",
  "role": "student",
  "semester": 4,
  "department": "Computer Science",
  "bio": "Passionate CS student",
  "uploads_count": 12,
  "total_ratings": 56.5,
  "recent_uploads": [...]
}
```

#### Update Profile
```http
PUT /api/profile/{user_id}/update
Content-Type: application/json

{
  "display_name": "John Doe Jr.",
  "bio": "Updated bio",
  "department": "Software Engineering",
  "semester": 5
}
```

---

### Analytics Endpoint

#### Get Analytics
```http
GET /api/analytics
```

**Response:**
```json
{
  "topic_weights": [
    {
      "topic_name": "Recursion",
      "weight": 15.5
    }
  ],
  "top_resources": [
    {
      "resource_id": "r123",
      "title": "Recursion Guide",
      "rating_avg": 4.8
    }
  ]
}
```

---

## Troubleshooting

### Common Issues

#### 1. Backend Won't Start

**Error:** `python: command not found`

**Solution:**
```bash
# Try python3 instead
python3 manage.py runserver 5001
```

#### 2. CORS Errors

**Error:** `Access-Control-Allow-Origin header is missing`

**Solution:** Check `backend_django/learnlink_backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
]
```

#### 3. Database Migration Errors

**Error:** `No such table: api_user`

**Solution:**
```bash
cd backend_django
python manage.py makemigrations
python manage.py migrate
```

#### 4. Port Already in Use

**Error:** `Port 5001 is already in use`

**Solution:**
```bash
# Find and kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Or use a different port
python manage.py runserver 5002
```

#### 5. Frontend Build Errors

**Error:** `Module not found`

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### 6. Authentication Not Working

**Issue:** Login successful but redirects back to login

**Solution:** Check browser console for errors. Clear localStorage:
```javascript
localStorage.clear()
```

---

## Production Deployment

### Frontend Deployment (Vercel)

1. **Build the app:**
```bash
npm run build
```

2. **Deploy to Vercel:**
```bash
npm i -g vercel
vercel
```

3. **Environment Variables:**
Set in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend Deployment (Railway/Heroku)

1. **Update settings.py:**
```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
SECRET_KEY = os.environ.get('SECRET_KEY')
```

2. **Add Procfile:**
```
web: gunicorn learnlink_backend.wsgi
```

3. **Install gunicorn:**
```bash
pip install gunicorn
pip freeze > requirements.txt
```

4. **Deploy:**
```bash
# Railway
railway up

# Heroku
heroku create
git push heroku main
heroku run python manage.py migrate
```

### Environment Variables (Production)

```bash
# Backend
SECRET_KEY=your-secret-key-here
DEBUG=False
DATABASE_URL=postgresql://...
ALLOWED_HOSTS=your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.com

# Frontend
VITE_API_URL=https://your-backend.com/api
```

---

## Security Best Practices

### For Production

1. **Use HTTPS** - Always use SSL/TLS in production
2. **Upgrade Password Hashing** - Replace SHA-256 with bcrypt or Argon2
3. **Session Security** - Use Redis for session storage
4. **CSRF Protection** - Enable Django CSRF middleware
5. **Rate Limiting** - Add API rate limiting
6. **Input Validation** - Validate all user inputs
7. **SQL Injection** - Use Django ORM (already safe)
8. **XSS Prevention** - Sanitize user content

---

## Support

For issues or questions:
- Check this guide thoroughly
- Review the main [README.md](./README.md)
- Create an issue in the repository
- Review [Product Requirements](./LearnLink-PRD.md)

---

**Last Updated:** October 30, 2025
