# Backend Function Reference — LearnLink (Django)

This document explains, function-by-function, the backend API implemented under `backend_django/api/`.
It covers helper utilities, view functions (endpoints), data models, and management commands. Use this as a developer reference when changing, calling, or testing the backend.

---

## Table of contents

- Overview
- Auth helpers & session management
- API endpoints (grouped)
  - Authentication
  - Health
  - Subjects & Topics
  - Resources
  - Analytics & Profile
- Models summary
- Management commands
- Error handling & notes
- Security and recommended improvements

---

## Overview

The backend is a small Django + DRF style API (using `rest_framework.decorators.api_view`) and plain Django models in `api/models.py`.

Key files:
- `backend_django/api/views.py` — main view functions and helpers (this file is the primary source for the functions in this doc)
- `backend_django/api/urls.py` — URL-to-view mapping (see each endpoint for route and method)
- `backend_django/api/models.py` — ORM model schema
- `backend_django/api/management/commands/seed_db.py` — database seeder

Notes:
- Session management currently uses an in-memory `sessions` dict inside `views.py`. This is suitable for development only.
- Passwords are hashed with SHA-256 (insecure for production). See Security section for recommendations.

---

## Auth helpers & session management

These are top-level helper functions in `views.py` used by authentication endpoints.

### hash_password(password)
- Purpose: Return a SHA-256 hex digest of `password`.
- Input: `password` (string)
- Output: hex string
- Notes: Uses `hashlib.sha256`. In production prefer `bcrypt`/`argon2` via Django's `make_password` / `check_password`.

### verify_password(password, hashed)
- Purpose: Check whether `password` (plain) matches `hashed` (stored hex string)
- Input: `password` (string), `hashed` (string)
- Output: boolean
- Implementation: compares `hash_password(password) == hashed`.

### create_session_token()
- Purpose: Generate a secure random session token string.
- Output: URL-safe token (32 byte-equivalent entropy) using `secrets.token_urlsafe(32)`.

### sessions (dict)
- Purpose: In-memory mapping of active session tokens to `user_id`.
- Type: Python dict: `{ token: user_id }`.
- Notes: Volatile and shared only within this process. For production use Redis or DB-backed sessions.

---

## API endpoints — Authentication

Base routes defined in `api/urls.py`.

### POST /auth/signup — signup(request)
- HTTP method: POST
- Route: `/auth/signup`
- Purpose: Create a new user and return a session token + user object
- Request body (JSON): { username, email, password, display_name?, role?, semester?, department? }
- Validation rules enforced:
  - `username`, `email`, and `password` are required
  - `password` length >= 6
  - `username` and `email` must be unique
- Behavior:
  - Hashes password with `hash_password`
  - Generates a short `user_id` (first 8 chars of a UUID)
  - Creates `User` record
  - Creates a session token and stores in `sessions`
- Response (success): {
  success: True,
  token: <session_token>,
  user: { user_id, username, email, display_name, role, semester, department }
}
- Error codes: 400 for validation, 500 for server errors

### POST /auth/login — login(request)
- HTTP method: POST
- Route: `/auth/login`
- Purpose: Authenticate and return session token + user
- Request body (JSON): { username, password }
  - `username` may be either username or email (login-by-email supported)
- Behavior:
  - Lookup user by username, else by email
  - Verify password with `verify_password`
  - Generate session token and store in `sessions`
- Response (success): {
  success: True,
  token: <session_token>,
  user: { user_id, username, email, display_name, role, semester, department, bio, specialization }
}
- Errors: 400 if missing fields, 401 if invalid credentials, 500 on server error

### POST /auth/logout — logout(request)
- HTTP method: POST
- Route: `/auth/logout`
- Purpose: Invalidate session token
- Behavior:
  - Reads Authorization header `Bearer <token>`
  - If token exists in `sessions`, deletes it
- Response: { success: True }
- Notes: Idempotent — deleting a non-existent token is treated as success

### GET /auth/me — get_current_user(request)
- HTTP method: GET
- Route: `/auth/me`
- Purpose: Returns the currently authenticated user's details
- Authentication: Reads Authorization header `Bearer <token>` and resolves `sessions[token]`
- Response: user object or 401 if not authenticated

---

## API endpoints — Health

### GET /health — health_check(request)
- HTTP method: GET
- Route: `/health`
- Purpose: Simple liveness check
- Response: { status: 'ok' }

---

## API endpoints — Subjects & Topics

### GET /subjects — get_subjects(request)
- HTTP method: GET
- Route: `/subjects`
- Purpose: List all subjects
- Response: List of objects with { subject_code, subject_name, semester }

### GET /subjects/<code> — get_subject(request, code)
- HTTP method: GET
- Route: `/subjects/<str:code>`
- Purpose: Return details for a subject by subject_code
- Response: { subject_code, subject_name, semester } or 404 if not found

### GET /topics — get_topics(request)
- HTTP method: GET
- Route: `/topics`
- Query params: `subject_code` (optional)
- Purpose: List topics across subjects or filtered by a subject
- Response items: { topic_name, subject_code, created_at (ISO), importance_score }

### POST /topics/important — mark_topic_important(request)
- HTTP method: POST
- Route: `/topics/important`
- Purpose: Allow users to flag a topic as important (increasing its importance_score)
- Request body (JSON): { topic_name, subject_code, created_by, reason? }
- Behavior:
  - Creates or fetches `ImportantTopic` record (unique by topic_name, subject, created_by)
  - If it's newly created, increments `Topic.importance_score` by 0.5 (capped at 10)
- Response: { success: True, new_importance_score: <float>, already_marked: <bool> }
- Errors: 400 on bad input

### GET /topics/important-list — get_important_topics(request)
- HTTP method: GET
- Route: `/topics/important-list`
- Purpose: Return topics ordered by importance_score (topics with score>0)
- Response items: { topic_name, subject_code, created_at, importance_score }

---

## API endpoints — Resources

### GET /resources — get_resources(request)
- HTTP method: GET
- Route: `/resources`
- Query params:
  - `topic_name` (optional) — filter by topic
  - `sort` (optional) — 'top' (rating_avg desc) or 'recent' (created_at desc)
- Response items: {
  resource_id, topic_name, subject_code, resource_type, title, description,
  file_path, video_url, uploaded_by: { user_id, username }, rating_avg, created_at
}

### GET /resources/<resource_id> — get_resource(request, resource_id)
- HTTP method: GET
- Route: `/resources/<str:resource_id>`
- Purpose: Return a single resource by `resource_id`
- Response: resource object (same fields as above) or 404 if not found

### POST /resources/upload — upload_resource(request)
- HTTP method: POST
- Route: `/resources/upload`
- Purpose: Create and store a new Resource. Accepts multipart form data or JSON.
- Expected fields (form-data or JSON): subject_code, topic_name, resource_type, title, description, uploaded_by, video_url? and file in multipart
- Behaviour:
  - Ensures `Subject` exists or creates it with defaults
  - Ensures `User` exists or creates a bare user record for `uploaded_by` (dev convenience)
  - Saves `file_path` as `/uploads/<filename>` if file present (no storage backend implemented)
  - Creates `Resource` record and ensures a `Topic` exists
- Response: 201 with the created resource object
- Errors: 400 for missing required fields, 500 for server exceptions

### POST /resources/<resource_id>/rate — rate_resource(request, resource_id)
- HTTP method: POST
- Route: `/resources/<str:resource_id>/rate`
- Purpose: Create or update a user's rating for a resource and update resource average
- Request body (JSON): { rating or rating_value, user_id? }
  - If `user_id` missing defaults to `'u1'` (dev convenience)
- Behavior:
  - Uses `Rating.objects.update_or_create(resource=resource, user=user, defaults={'rating_value': rating_value})`
  - Recalculates average: `Rating.objects.filter(resource=resource).aggregate(Avg('rating_value'))`
  - Saves `resource.rating_avg = round(avg, 2)`
- Response: { success: True, new_avg_rating, is_new_rating, user_rating }
- Errors: 400 for missing rating, 404 if resource not found
- Notes: Atomicity not explicitly handled; concurrent rating updates may cause race conditions. Consider DB transactions or `F()` updates in production.

---

## API endpoints — Analytics & Profile

### GET /analytics — get_analytics(request)
- HTTP method: GET
- Route: `/analytics`
- Purpose: Return lightweight analytics snapshot
- Response: {
  topic_weights: [{ topic_name, weight }],
  top_resources: [{ resource_id, title, rating_avg }]
}
- Implementation: top 10 topics by `importance_score`, top 5 resources by `rating_avg`

### GET /profile/<user_id> — get_profile(request, user_id)
- HTTP method: GET
- Route: `/profile/<str:user_id>`
- Purpose: Return public profile info and recent uploads summary
- Response: {
  user_id, username, display_name, role, semester, department, bio, specialization,
  uploads_count, total_ratings, recent_uploads: [resource objects...]
}
- `total_ratings` calculation: sum of `resource.rating_avg` for resources uploaded by the user (note: this sums averages, not counts)
- Errors: 404 if user not found

### PUT/PATCH /profile/<user_id>/update — update_profile(request, user_id)
- HTTP method: PUT or PATCH
- Route: `/profile/<str:user_id>/update`
- Purpose: Update allowed profile fields
- Allowed updates: `display_name, bio, department, semester, specialization`
- Request body (JSON): fields to update
- Response: { success: True, user: <user object> } or 404 if user not found

---

## Models summary (from `api/models.py`)

This section lists each Django model and key fields, plus notable constraints.

### User
- Fields: user_id (PK), username (unique), email (unique, optional), password (hashed), display_name, role, semester, department, bio, specialization, created_at
- Notes: `password` stores hashed value from `hash_password`.

### Subject
- Fields: subject_code (PK), subject_name, semester
- Purpose: Top-level subject catalog.

### Topic
- Fields: topic_name, subject (FK to `Subject.subject_code`), created_at, importance_score
- Meta: unique_together = (`topic_name`, `subject`)
- Notes: `importance_score` is float and used by analytics/important topics ranking.

### Resource
- Fields: resource_id (PK), topic_name, subject (FK), resource_type (choice), title, description, file_path, video_url, uploaded_by (FK to User.user_id), rating_avg, created_at
- Notes: `resource_type` choices: note, video, past_paper, tutorial.

### Rating
- Fields: rating_id (PK), resource (FK), user (FK), rating_value (int), created_at
- Meta: unique_together = (`resource`, `user`)
- Notes: `update_or_create` is used to create/update a user's rating for a resource.

### ImportantTopic
- Fields: flag_id (PK), topic_name, subject (FK), created_by (FK), reason, created_at
- Meta: unique_together = (`topic_name`, `subject`, `created_by`)

---

## Management command — seed_db

File: `api/management/commands/seed_db.py`

Purpose: Populate the database with sample users, subjects, topics, resources, and ratings for development and testing.

Usage:

```bash
# from project root, with virtualenv activated
python backend_django/manage.py seed_db
```

What it does:
- Creates a set of example users (u1..u5)
- Creates common subjects and topics with varied `importance_score`
- Adds several resources with `rating_avg` prefilled
- Adds ratings for some resources

Notes: Idempotent behavior (uses `get_or_create`) so re-running won't create duplicates for identical keys.

---

## Error handling, edge cases, and known behaviours

- Authentication: sessions are stored in-memory. When the server restarts, all sessions are lost.
- Password hashing: SHA-256 is used — this is not salted with per-user salt and is unsuitable for production.
- Rating average: Calculated by averaging `Rating.rating_value` and saved to `Resource.rating_avg` rounded to 2 decimals.
- Uploads: Files are "stored" by recording `/uploads/<filename>` in `file_path`. No real persistent storage or media backend is configured.
- Topic importance increment: incremented by 0.5 on first flag by a user, capped at 10.
- Creating related objects: Several endpoints auto-create `User` or `Subject` records if missing. This convenience behavior is acceptable for dev but may be undesired in production where strict integrity should be enforced.

---

## Security & recommended improvements

This backend works for local development. For production hardening consider:

1. Password hashing
   - Use Django's `make_password` / `check_password` or `bcrypt`/`argon2` instead of SHA-256
2. Sessions & auth
   - Replace in-memory `sessions` with Django sessions, JWTs, or Redis-backed tokens
   - Add expiration and refresh mechanisms
   - Add authentication decorators for protected endpoints
3. File uploads
   - Configure Django `MEDIA_ROOT` and a secure file storage (S3, GCS) with signed URLs
4. Concurrency & transactions
   - Wrap rating updates in DB transactions (or use `select_for_update`) to prevent race conditions
5. Input validation & serialization
   - Replace raw `json.loads(request.body)` with DRF serializers for validation and cleaner view code
6. Rate limiting & throttling
   - Add throttling middleware to protect endpoints from abuse
7. CORS & headers
   - Ensure CORS is configured properly only for allowed frontends and add security headers (HSTS, CSP)

---

## Quick examples

Signup example (curl):

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"secret123","semester":3}'
```

Rate resource example:

```bash
curl -X POST http://localhost:5001/api/resources/RESOURCE_ID/rate \
  -H "Content-Type: application/json" \
  -d '{"rating":5, "user_id":"u1"}'
```

Get resources (top):

```bash
curl "http://localhost:5001/api/resources?sort=top"
```

---

## Where to look in code

- `backend_django/api/views.py` — implementation of the functions documented above
- `backend_django/api/urls.py` — route mapping
- `backend_django/api/models.py` — model definitions
- `backend_django/api/management/commands/seed_db.py` — seeder

---

## Final notes

This document is intended as a developer-facing reference. If you'd like, I can:
- Expand each endpoint with exact sample request/response bodies captured from live server responses
- Convert view functions to DRF viewsets + serializers for stronger typing and validation
- Add unit tests for critical flows (signup/login, upload, rate)

If you'd like any of those next steps, tell me which and I'll implement them.
