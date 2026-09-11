# LearnLink

**A community-driven academic resource platform — students share study material, rate what
actually helped, and the ratings surface what matters before an exam.**

Every cohort rediscovers the same problem: the genuinely useful notes, the one tutorial
that explains recursion properly, the past paper that predicted half the exam — all of it
lives in scattered WhatsApp groups and dies at the end of the semester. The next batch
starts from zero.

LearnLink makes that knowledge persistent and ranked. Students upload resources against a
subject and topic, rate what they used, and flag topics as exam-critical. The platform
aggregates those signals into a view of what to study and which material to trust.

---

## Features

| Feature | Detail |
|---|---|
| **Resource sharing** | Notes, videos, past papers, and tutorials — file upload or YouTube links |
| **Structured taxonomy** | Organised by subject → topic → semester, not a flat dump |
| **Community ratings** | Rate resources; ratings are updateable, so a second opinion replaces a first impression |
| **Important topics** | Students flag exam-critical topics; weight accumulates across the cohort |
| **Analytics dashboard** | Topic importance scores, top-rated resources, subject-wise distribution |
| **User profiles** | Semester, department, bio, upload history, and contribution stats |
| **Filtering and sort** | By rating, date, resource type, and subject |

## Architecture

A React SPA talking to a Django REST backend over a flat JSON API.

```
React + TypeScript (Vite, port 8080)  ──►  Django REST API (port 5001)  ──►  SQLite
        shadcn/ui + Tailwind                    6 models, 17 endpoints
```

**Data model** — `User`, `Subject`, `Topic`, `Resource`, `Rating`, `ImportantTopic`.
Ratings and importance flags are separate entities rather than counters on the resource, so
a student's individual vote stays editable and the aggregate is always derivable.

**API surface** — auth (`signup`, `login`, `logout`, `me`), subjects, topics,
important-topic flagging, resource upload and rating, analytics, and profile read/update.

## Quick start

You need two terminals — the frontend and backend run as separate processes.

```bash
git clone https://github.com/Ujjwal-6/LearnLink.git
cd LearnLink
```

**Terminal 1 — Django backend (port 5001):**

```bash
cd backend_django
python3 -m venv venv && source venv/bin/activate
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py runserver 5001
```

**Terminal 2 — React frontend (port 8080):**

```bash
npm install
npm run dev
```

Open **http://localhost:8080**. CORS is preconfigured for this port pair.

## Tech stack

**Frontend** — React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix primitives),
React Hook Form + Zod

**Backend** — Django, Django REST Framework, SQLite, django-cors-headers

## Repository layout

```
src/
  pages/          12 routes — Dashboard, Resources, Upload, Analytics, Subjects, …
  components/ui/  shadcn/ui component library
  contexts/       auth and app-level state
  hooks/          shared React hooks
backend_django/
  api/            models, views, urls, migrations
  learnlink_backend/  Django settings
docs/             PRD and design notes
```

## Documentation

- [LearnLink-PRD.md](docs/LearnLink-PRD.md) — full product requirements: personas, scope,
  functional and non-functional requirements, API contracts, success metrics
- [DOCS.md](docs/DOCS.md) — developer notes
- [SETUP.md](docs/SETUP.md) — detailed environment setup

## Status

Working full-stack prototype running locally end-to-end. Authentication is session-based
and intentionally simple; SQLite is fine at this scale but would need swapping for a
multi-user deployment. Not currently hosted.

## License

Not currently licensed — all rights reserved. Open an issue if you'd like to use it.
