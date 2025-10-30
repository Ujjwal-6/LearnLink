# Running LearnLink on a Different Computer

This guide explains how to set up and run LearnLink on a new machine after cloning from GitHub.

---

## Prerequisites

Before starting, ensure your computer has the following installed:

### Required
- **Python 3.9+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** (includes npm) — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)

### Verify Installation
Run these commands to check:

```bash
python --version
node --version
npm --version
git --version
```

All should show version numbers.

---

## Step 1: Clone the Repository

```bash
# Clone from GitHub (replace <your-username> with your GitHub username)
git clone https://github.com/<your-username>/LearnLink.git

# Navigate into the project
cd LearnLink
```

---

## Step 2: Backend Setup (Django)

### 2a. Navigate to backend directory

```bash
cd backend_django
```

### 2b. Create a Python virtual environment

```bash
# macOS / Linux
python3 -m venv venv

# Windows
python -m venv venv
```

### 2c. Activate the virtual environment

```bash
# macOS / Linux
source venv/bin/activate

# Windows (Command Prompt)
venv\Scripts\activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1
```

After activation, your terminal prompt should show `(venv)` at the beginning.

### 2d. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 2e. Run database migrations

```bash
python manage.py migrate
```

### 2f. Seed the database with sample data (optional but recommended)

```bash
python manage.py seed_db
```

This creates test users, subjects, topics, and resources to explore.

### 2g. Start the backend server

```bash
python manage.py runserver 5001
```

You should see:
```
Starting development server at http://127.0.0.1:5001/
```

**Leave this running in a terminal.** The backend API will be available at `http://localhost:5001`.

---

## Step 3: Frontend Setup (React + Vite)

Open a **new terminal** and navigate to the project root:

```bash
# From the LearnLink directory (not backend_django)
cd ..
```

### 3a. Install Node dependencies

```bash
npm install
```

Or if you use yarn/pnpm:
```bash
yarn install
# or
pnpm install
```

### 3b. Start the frontend dev server

```bash
npm run dev
```

You should see output like:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

Open your browser and go to `http://localhost:5173/`.

---

## Step 4: Access the Application

1. **Frontend:** http://localhost:5173/
2. **Backend API:** http://localhost:5001/api/

### Test Login Credentials (from seeded data)

Use any of these accounts to test:

```
Username: john_doe
Password: (any password for test)

Username: jane_smith
Password: (any password for test)

Username: alex_wilson
Password: (any password for test)
```

**Note:** In development, the backend accepts any password for seeded users. See Security section below.

---

## Project Structure

```
LearnLink/
├── frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Subjects, Topics, Resources, etc.)
│   │   ├── contexts/       # React context (authentication)
│   │   └── lib/            # API client (mockApi.ts)
│   ├── package.json
│   └── vite.config.ts
│
├── backend_django/  (Django REST API)
│   ├── api/
│   │   ├── views.py        # API endpoints
│   │   ├── models.py       # Database models
│   │   ├── urls.py         # URL routing
│   │   └── management/commands/seed_db.py
│   ├── requirements.txt
│   ├── manage.py
│   └── db.sqlite3          # SQLite database (auto-created)
│
├── README.md               # Main documentation
├── SETUP.md                # Detailed setup guide
├── DOCS.md                 # Documentation index
├── LearnLink-PRD.md        # Product requirements
└── .gitignore              # Git ignore rules
```

---

## Common Issues & Solutions

### Backend won't start: `Port 5001 already in use`

**Solution:** Change the port
```bash
python manage.py runserver 8000
```
Then update the frontend API URL in `src/lib/mockApi.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Frontend won't start: `EADDRINUSE: address already in use :::5173`

**Solution:** Use a different port
```bash
npm run dev -- --port 3000
```

### Python virtual environment won't activate on Windows

Try PowerShell instead of Command Prompt:
```powershell
# In PowerShell
venv\Scripts\Activate.ps1
```

Or set execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### `ModuleNotFoundError: No module named 'rest_framework'`

**Solution:** You're not in the virtual environment or dependencies weren't installed
```bash
cd backend_django
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Database migration errors

**Solution:** Reset the database
```bash
cd backend_django
rm db.sqlite3  # macOS/Linux
del db.sqlite3  # Windows
python manage.py migrate
python manage.py seed_db
```

---

## Development Workflow

### Daily startup (2 terminals)

**Terminal 1 — Backend:**
```bash
cd backend_django
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver 5001
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Making changes

- **Frontend changes:** Vite hot-reloads automatically
- **Backend changes:** Django auto-reloads most changes; restart if needed

---

## Features Overview

### Authentication
- Signup / Login with username, email, password
- Session-based authentication (tokens stored in localStorage)
- Protected routes (login required to access dashboard, resources, etc.)

### Core Features
1. **Subjects** — Browse subjects filtered by semester
2. **Topics** — View topics for a subject, filter by importance (High/Medium/Low)
3. **Resources** — Browse resources for a topic, filter by rating (High/Medium/Low), sort by rating or recency
4. **Upload** — Share new study materials (notes, videos, past papers, tutorials)
5. **Rating System** — Rate resources 1-5 stars; see average ratings update in real-time
6. **Profile** — View user profile, recent uploads, total ratings
7. **Analytics** — Dashboard with trending topics and top-rated resources
8. **Important Topics** — Mark topics important; tracked in database

---

## Database Models

The SQLite database includes:

- **User** — username, email, semester, department, bio, role
- **Subject** — subject_code, subject_name, semester
- **Topic** — topic_name, subject, importance_score
- **Resource** — title, description, file_path, video_url, resource_type, rating_avg
- **Rating** — rating_value, resource, user
- **ImportantTopic** — topic_name, subject, created_by, reason

---

## API Documentation

Full API endpoint reference is in `backend_django/BACKEND_FUNCTIONS.md`.

Key endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/signup` | POST | Register new user |
| `/auth/login` | POST | Login with credentials |
| `/subjects` | GET | List all subjects |
| `/topics` | GET | List topics (filter by subject) |
| `/resources` | GET | List resources (filter by topic/subject) |
| `/resources/upload` | POST | Upload new resource |
| `/resources/<id>/rate` | POST | Rate a resource |
| `/profile/<user_id>` | GET | User profile |

---

## Deployment (Optional)

For production deployment, see `SETUP.md` section on "Production Deployment".

Key points:
- Set `DEBUG=False` in Django settings
- Use a production database (PostgreSQL recommended)
- Configure environment variables
- Use a production web server (Gunicorn)
- Set up CORS properly
- Add HTTPS/SSL certificates

---

## Need Help?

1. **Check documentation:**
   - `README.md` — Project overview
   - `SETUP.md` — Detailed setup & API docs
   - `DOCS.md` — Documentation index
   - `backend_django/BACKEND_FUNCTIONS.md` — Backend function reference

2. **Check the code:**
   - Frontend: `src/pages/`, `src/components/`
   - Backend: `backend_django/api/views.py`, `backend_django/api/models.py`

3. **Common issues:**
   - See "Common Issues & Solutions" section above

---

## Next Steps

- Explore the app — Create an account, upload resources, rate them
- Customize styling — Modify `src/App.css` or Tailwind config
- Add features — Check `backend_django/BACKEND_FUNCTIONS.md` for API details
- Deploy — Follow production setup in `SETUP.md`

Happy coding! 🚀
