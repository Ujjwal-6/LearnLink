# 📚 LearnLink Documentation

Welcome to LearnLink! This guide will help you navigate the documentation.

---

## 🚀 Getting Started

**New to LearnLink?** Start here:

1. **[README.md](./README.md)** - Main project overview, features, and quick start guide
2. **[SETUP.md](./SETUP.md)** - Detailed installation and configuration instructions
3. **[LearnLink-PRD.md](./LearnLink-PRD.md)** - Complete product requirements and specifications

---

## 📖 Documentation Structure

### Main Documentation

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Project overview, features, quick start | Everyone |
| `SETUP.md` | Installation, API docs, troubleshooting | Developers |
| `LearnLink-PRD.md` | Product requirements, specifications | Product team, developers |
| `backend_django/README.md` | Backend-specific documentation | Backend developers |

---

## 🎯 Quick Links by Task

### I want to...

**Run the application locally**
→ See [Quick Start in README.md](./README.md#-quick-start)

**Set up the development environment**
→ See [Installation in SETUP.md](./SETUP.md#installation)

**Understand the API endpoints**
→ See [API Documentation in SETUP.md](./SETUP.md#api-documentation)

**Learn about authentication**
→ See [Authentication in SETUP.md](./SETUP.md#authentication-configuration)

**Deploy to production**
→ See [Production Deployment in SETUP.md](./SETUP.md#production-deployment)

**Understand database models**
→ See [Database Models in README.md](./README.md#-database-models)

**Fix issues**
→ See [Troubleshooting in SETUP.md](./SETUP.md#troubleshooting)

**Contribute to the project**
→ See [Contributing in README.md](./README.md#-contributing)

---

## 🏗️ Architecture Overview

```
LearnLink Application
│
├── Frontend (React + TypeScript)
│   ├── Port: 8080
│   ├── Tech: React 18, Vite, TailwindCSS
│   └── Auth: Session-based with localStorage
│
├── Backend (Django REST Framework)
│   ├── Port: 5001
│   ├── Tech: Django 4.2, SQLite
│   └── API: RESTful endpoints
│
└── Database (SQLite → PostgreSQL for production)
    ├── Models: User, Subject, Topic, Resource, Rating
    └── ORM: Django ORM
```

---

## 🔑 Key Features

1. **Authentication System** - Secure signup/login with session tokens
2. **Resource Management** - Upload and share study materials
3. **Rating System** - Rate resources, update ratings anytime
4. **Important Topics** - Community-driven exam preparation
5. **User Profiles** - Personal stats and upload history
6. **Analytics Dashboard** - Trending topics and top resources

---

## 📁 File Organization

```
LearnLink/
├── README.md                    ← Start here
├── SETUP.md                     ← Detailed setup guide
├── LearnLink-PRD.md            ← Product requirements
├── DOCS.md                      ← This file
│
├── src/                         ← React frontend
│   ├── components/             ← UI components
│   ├── pages/                  ← Page components
│   ├── contexts/               ← React contexts
│   └── lib/                    ← Utilities and API
│
├── backend_django/             ← Django backend
│   ├── api/                    ← API application
│   ├── learnlink_backend/      ← Django settings
│   └── README.md               ← Backend docs
│
└── public/                     ← Static assets
```

---

## 🆘 Getting Help

### Documentation
1. Check the specific documentation file for your task
2. Search for your issue in [Troubleshooting](./SETUP.md#troubleshooting)
3. Review the [PRD](./LearnLink-PRD.md) for feature specifications

### Common Issues
- **Can't start backend?** → [Backend Setup](./SETUP.md#backend-setup-django)
- **Authentication errors?** → [Auth Config](./SETUP.md#authentication-configuration)
- **CORS issues?** → [Troubleshooting](./SETUP.md#troubleshooting)
- **Database problems?** → [Database Setup](./SETUP.md#database-setup)

### Support
- Create an issue in the repository
- Check existing issues for solutions
- Review closed issues for similar problems

---

## 🎓 Learning Path

### For Students/Users
1. Read [README.md](./README.md) → Features overview
2. Follow [Quick Start](./README.md#-quick-start) → Get it running
3. Explore the application → Upload, rate, explore!

### For Developers
1. Read [README.md](./README.md) → Project overview
2. Follow [SETUP.md](./SETUP.md) → Complete installation
3. Review [PRD](./LearnLink-PRD.md) → Understand requirements
4. Check [API Documentation](./SETUP.md#api-documentation) → Build features
5. Read code → Understand implementation

### For Product Managers
1. Read [PRD](./LearnLink-PRD.md) → Full requirements
2. Review [README.md](./README.md) → Current features
3. Check [Database Models](./README.md#-database-models) → Data structure

---

## 📊 Tech Stack Reference

| Layer | Technology | Version | Documentation |
|-------|-----------|---------|---------------|
| Frontend Framework | React | 18 | [React Docs](https://react.dev) |
| Language | TypeScript | 5.0 | [TS Docs](https://typescriptlang.org) |
| Build Tool | Vite | 5.0 | [Vite Docs](https://vitejs.dev) |
| Styling | Tailwind CSS | 3.0 | [TW Docs](https://tailwindcss.com) |
| UI Components | shadcn/ui | Latest | [shadcn](https://ui.shadcn.com) |
| Backend Framework | Django | 4.2 | [Django Docs](https://docs.djangoproject.com) |
| API | DRF | 3.16 | [DRF Docs](https://www.django-rest-framework.org) |
| Database | SQLite/PostgreSQL | - | [SQLite](https://sqlite.org) |
| State Management | TanStack Query | 5 | [TQ Docs](https://tanstack.com/query) |
| Routing | React Router | 6 | [RR Docs](https://reactrouter.com) |

---

## 🔄 Update History

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-30 | 1.0 | Initial release with authentication system |

---

## 📞 Contact & Support

- **Issues**: Create an issue in the repository
- **Questions**: Check documentation first, then create an issue
- **Contributions**: See [Contributing Guide](./README.md#-contributing)

---

**Documentation last updated:** October 30, 2025

**Happy Learning! 🎉**
