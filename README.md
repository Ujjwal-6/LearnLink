# LearnLink 🎓# LearnLink



A modern academic resource sharing platform that connects students and educators through collaborative learning. Built with React, TypeScript, Tailwind CSS, and Django REST Framework.# LearnLink



![Tech Stack](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react)A modern learning resource management platform built with React, TypeScript, Tailwind CSS, and Django REST API.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat&logo=typescript)

![Django](https://img.shields.io/badge/Django-4.2-092e20?style=flat&logo=django)## 🚀 Quick Start

![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat&logo=tailwindcss)

### 1. Start Django Backend (Port 5001)

---```bash

cd backend_django

## ✨ Features./start_backend.sh

```

### 📚 **Resource Management**

- Upload and share study materials (notes, videos, past papers, tutorials)### 2. Start React Frontend (Port 8080)

- Organize by subjects, topics, and semesters```bash

- Support for file uploads and YouTube video linksnpm run dev

- Advanced filtering and sorting (by rating, date, type)```



### ⭐ **Community-Driven**### 3. Open Browser

- Rate and review resources (updateable ratings)```

- Mark important topics for exam preparationhttp://localhost:8080

- View top-rated resources and trending topics```

- See upload statistics and contributor profiles

## ✅ What's Working

### 👤 **User Authentication & Profiles**

- Secure signup and login system- ✅ **Django REST API** - Full backend on port 5001

- User profiles with semester, department, and bio- ✅ **SQLite Database** - 9 resources, 6 subjects, 17 topics, 5 users

- Track personal uploads and contributions- ✅ **Upload Resources** - Persist to database

- Display user statistics and recent activity- ✅ **User Profiles** - With upload history

- ✅ **Analytics** - Topic weights and top resources

### 📊 **Analytics Dashboard**- ✅ **CORS Enabled** - Frontend ↔ Backend communication

- Topic importance scores based on community flags

- Top-rated resources visualization## Features

- Subject-wise resource distribution

- Recent uploads and activity tracking- 📚 Browse subjects and topics

- 📝 Upload and share study resources (notes, videos, past papers)

### 🎨 **Modern UI/UX**- ⭐ Rate and review resources

- Clean, responsive design with Tailwind CSS- 📊 Analytics dashboard for trending topics

- Dark mode support (themed components)- 🎯 Important topics tracking with community flagging

- Smooth animations with Framer Motion- 👤 User profiles with visibility settings (student/professor)

- Mobile-friendly interface- 🔍 Advanced search and filtering

- shadcn/ui component library

## Tech Stack

---

### Frontend

## 🚀 Quick Start- **React 18** - UI framework

- **TypeScript** - Type safety

### Prerequisites- **Vite** - Build tool

- Node.js 18+ and npm- **React Router** - Client-side routing

- Python 3.9+- **TanStack Query** - Data fetching & caching

- Git- **React Hook Form + Zod** - Form validation

- **Tailwind CSS** - Styling

### 1. Clone the Repository- **shadcn/ui** - Component library

```bash- **Framer Motion** - Animations

git clone <repository-url>- **Recharts** - Data visualization

cd LearnLink

```### Backend

- **Node.js + Express** - REST API

### 2. Start the Backend (Django)- **PostgreSQL** - Database

```bash- **TypeScript** - Type safety

cd backend_django- **Multer** - File uploads

chmod +x start_backend.sh- **Helmet + CORS** - Security

./start_backend.sh

```## Getting Started

Backend runs on `http://localhost:5001`

### Prerequisites

### 3. Start the Frontend (React)

```bash- Node.js 18+ and npm

# In a new terminal, from the root directory- PostgreSQL 14+ (for backend)

npm install

npm run dev### Quick Start (Frontend Only with Mock API)

```

Frontend runs on `http://localhost:8080````bash

# Install frontend dependencies

### 4. Access the Applicationnpm install

Open your browser and navigate to:

```# Start development server

http://localhost:8080npm run dev

``````



**First Time Setup:**Frontend runs on `http://localhost:5173`

1. Click "Get Started" → "Sign up"

2. Create an account with your details### Full Stack Setup (Frontend + Backend)

3. Start uploading and exploring resources!

#### 1. Setup Backend

---

```bash

## 📁 Project Structurecd backend



```# Install dependencies

LearnLink/npm install

├── backend_django/              # Django REST API

│   ├── api/                     # API app# Create PostgreSQL database

│   │   ├── models.py           # Database modelscreatedb learnlink_db

│   │   ├── views.py            # API endpoints

│   │   ├── urls.py             # URL routing# Copy and configure environment

│   │   └── migrations/         # Database migrationscp .env.example .env

│   ├── learnlink_backend/      # Django settings# Edit .env with your database credentials

│   ├── db.sqlite3              # SQLite database

│   └── start_backend.sh        # Backend startup script# Run database migrations

│npm run db:migrate

├── src/                         # React frontend

│   ├── components/             # Reusable UI components# Seed with sample data

│   │   ├── ui/                # shadcn/ui componentsnpm run db:seed

│   │   ├── Navbar.tsx         # Navigation bar

│   │   ├── AppSidebar.tsx     # Side navigation# Start backend server

│   │   ├── ResourceCard.tsx   # Resource displaynpm run dev

│   │   └── ...```

│   ├── pages/                  # Page components

│   │   ├── Login.tsx          # Login pageBackend runs on `http://localhost:5000`

│   │   ├── Signup.tsx         # Signup page

│   │   ├── Dashboard.tsx      # Main dashboard#### 2. Setup Frontend

│   │   ├── Subjects.tsx       # Subject listing

│   │   ├── Topics.tsx         # Topic listing```bash

│   │   ├── Resources.tsx      # Resource listing# Return to root directory

│   │   ├── Upload.tsx         # Upload formcd ..

│   │   ├── Profile.tsx        # User profile

│   │   └── Analytics.tsx      # Analytics view# Install dependencies

│   ├── contexts/              # React contextsnpm install

│   │   └── AuthContext.tsx   # Authentication state

│   ├── lib/                   # Utilities# Start frontend

│   │   ├── mockApi.ts        # API clientnpm run dev

│   │   └── utils.ts          # Helper functions```

│   └── hooks/                # Custom React hooks

│#### 3. Update Frontend to Use Backend

├── public/                    # Static assets

├── package.json              # Frontend dependenciesEdit `src/lib/mockApi.ts` to point to real backend or create `src/lib/apiClient.ts` with Axios calls to `http://localhost:5000/api`.

└── README.md                # This file

```## Project Structure



---```

learnlink-vista-88/

## 🛠️ Tech Stack├── frontend/

│   ├── src/

### **Frontend**│   │   ├── components/      # Reusable UI components

- **React 18** - UI library│   │   ├── pages/          # Page components

- **TypeScript** - Type safety│   │   ├── lib/            # Utilities and mock API

- **Vite** - Build tool and dev server│   │   ├── hooks/          # Custom React hooks

- **React Router v6** - Client-side routing│   │   └── index.css       # Global styles & design system

- **TanStack Query** - Data fetching and caching│   ├── package.json

- **Tailwind CSS** - Utility-first CSS│   └── vite.config.ts

- **shadcn/ui** - High-quality component library└── backend/

- **Framer Motion** - Animation library    ├── src/

- **React Hook Form + Zod** - Form handling and validation    │   ├── database/       # DB connection, migrations, seeds

- **Recharts** - Data visualization    │   ├── routes/         # API route handlers

    │   ├── types/          # TypeScript interfaces

### **Backend**    │   └── server.ts       # Express app

- **Django 4.2** - Python web framework    ├── uploads/            # File uploads directory

- **Django REST Framework** - API toolkit    ├── package.json

- **SQLite** - Database (development)    └── README.md           # Backend-specific docs

- **CORS Headers** - Cross-origin support```

- **Python 3.9+** - Programming language

## API Endpoints

---

Full backend API documentation in `backend/README.md`. Key endpoints:

## 🔐 Authentication System

### Subjects

### **Features**- `GET /api/subjects` - List all subjects

- Secure user signup and login- `GET /api/subjects/:code` - Get single subject

- Password hashing (SHA-256)

- Session-based authentication with tokens### Topics

- Protected routes on frontend- `GET /api/topics?subject_code=CS101` - Get topics (with filters)

- Automatic session restoration- `GET /api/topics/important` - Get important topics

- User profile management- `POST /api/topics/important` - Mark topic as important



### **User Roles**### Resources

- **Student** - Default role for learners- `GET /api/resources?topic_name=Recursion&sort=top` - Get resources with filters

- **Teacher** - For educators and professors- `GET /api/resources/:id` - Get single resource

- **Admin** - For platform administrators- `POST /api/resources/upload` - Upload resource (multipart/form-data)

- `POST /api/resources/:id/rate` - Rate a resource

### **Session Management**

- Tokens stored in localStorage### Profile

- Automatic logout on token expiry- `GET /api/profile/:id` - Get user profile (respects visibility)

- Secure session handling- `PUT /api/profile/:id` - Update profile (role, visibility, etc.)



---### Analytics

- `GET /api/analytics` - Get topic weights and top resources

## 📡 API Endpoints

## Authentication (Phase 1 - MVP)

### **Authentication**

```Authentication is **stubbed** in Phase 1. User actions use mock user ID (`u1`). Phase 2 will implement:

POST   /api/auth/signup        - Create new account

POST   /api/auth/login         - Login user- JWT-based authentication

POST   /api/auth/logout        - Logout user- Password hashing

GET    /api/auth/me            - Get current user- Protected routes

```- OAuth/SSO integration



### **Subjects & Topics**## Design System

```

GET    /api/subjects           - List all subjectsThe app uses a semantic design system defined in `src/index.css`:

GET    /api/subjects/:code     - Get subject details

GET    /api/topics             - List topics (filter by subject)- **Primary**: Deep indigo (#3730A3) - Main brand color

POST   /api/topics/important   - Mark topic important- **Accent**: Violet (#8B5CF6) - Highlights and CTAs

GET    /api/topics/important-list - Get important topics- **Gradients**: Used for hero sections and cards

```- **Success/Warning**: Additional semantic colors



### **Resources**All colors use HSL format for easy theming.

```

GET    /api/resources          - List resources (with filters)## Available Scripts

GET    /api/resources/:id      - Get resource details

POST   /api/resources/upload   - Upload new resource- `npm run dev` - Start development server

POST   /api/resources/:id/rate - Rate a resource- `npm run build` - Build for production

```- `npm run preview` - Preview production build

- `npm run lint` - Run ESLint

### **Profile & Analytics**

```## User Roles & Profile Visibility

GET    /api/profile/:userId    - Get user profile

PUT    /api/profile/:userId/update - Update profile### Roles

GET    /api/analytics          - Get analytics data- **Student**: Upload resources, mark important topics, view stats

```- **Professor**: Same as student + additional credibility

- **Admin**: Content moderation (Phase 2)

For detailed API documentation and setup instructions, see [SETUP.md](./SETUP.md)

### Profile Visibility

---Users can set profile to:

- **Public**: Anyone can view uploads, stats, and contributions

## 💡 Key Features Explained- **Private**: Only basic info visible, uploads hidden



### **Rating System**Update via `PUT /api/profile/:id` with `profile_visibility: 'public' | 'private'`

- Users can rate resources on a scale of 1-5 stars

- Ratings can be updated anytime## Development

- Average rating calculated and displayed in real-time

- Prevents duplicate ratings (one per user per resource)### Frontend Development

```bash

### **Important Topics**npm run dev          # Start Vite dev server

- Community-driven topic flagging for exam prepnpm run build        # Build for production

- Importance score increases with more flagsnpm run lint         # Run ESLint

- One flag per user per topic per subject```

- Displayed on dashboard and analytics

### Backend Development

### **Resource Upload**```bash

- Supports multiple file types (PDF, images, etc.)cd backend

- YouTube video URL integrationnpm run dev          # Start with auto-reload

- Rich metadata (subject, topic, description)npm run db:migrate   # Run database migrations

- Automatic subject/topic creation if needednpm run db:seed      # Seed sample data

npm run build        # Build TypeScript

### **User Profiles**```

- Display user information and statistics

- Show recent uploads and contributions### Connecting Frontend to Backend

- Track total uploads and average ratings

- Semester and department informationReplace `src/lib/mockApi.ts` calls with Axios/fetch to `http://localhost:5000/api`. Example:



---```typescript

// src/lib/apiClient.ts

## 🎨 Design Systemimport axios from 'axios';



The application uses a consistent design system with:const api = axios.create({

  baseURL: 'http://localhost:5000/api',

### **Color Palette**  timeout: 5000,

- **Primary**: Deep indigo (#3730A3) - Brand color});

- **Accent**: Violet (#8B5CF6) - Highlights and CTAs

- **Success**: Green - Positive actionsexport const getSubjects = () => api.get('/subjects').then(res => res.data);

- **Warning**: Orange - Important noticesexport const getTopics = (subject_code?: string) => 

- **Error**: Red - Errors and destructive actions  api.get('/topics', { params: { subject_code } }).then(res => res.data);

// ... etc

### **Typography**```

- Font family: Inter (system fallback)

- Responsive font sizing## Phase 1 vs Phase 2

- Consistent spacing and line heights

**Phase 1 (Current - MVP):**

### **Components**- ✅ Full CRUD for resources, topics, subjects

- Based on shadcn/ui component library- ✅ Rating system with aggregation

- Fully accessible (ARIA compliant)- ✅ Important topics tracking

- Consistent styling across the app- ✅ Analytics dashboard

- Smooth transitions and animations- ✅ Profile visibility settings

- ✅ File uploads (local storage)

---- ⚠️ No real authentication (user IDs passed directly)



## 🧪 Development**Phase 2 (Planned):**

- JWT authentication with login/signup

### **Frontend Development**- AWS S3 file storage

```bash- Admin dashboard and moderation tools

npm run dev          # Start dev server (port 8080)- Advanced search (Elasticsearch)

npm run build        # Build for production- Real-time notifications (WebSockets)

npm run preview      # Preview production build- Mentorship request workflow

npm run lint         # Run ESLint- Dark mode

```- Mobile apps



### **Backend Development**## Documentation

```bash

cd backend_django- **Frontend**: See comments in `src/` files

python manage.py runserver 5001      # Start server- **Backend**: See `backend/README.md` for API docs

python manage.py makemigrations      # Create migrations- **Product Requirements**: See `LearnLink-PRD.md` for full spec

python manage.py migrate             # Apply migrations- **AI Agent Guide**: See `.github/copilot-instructions.md`

python manage.py createsuperuser     # Create admin user

```## Contributing



### **Database**1. Fork the repository

- Development: SQLite (db.sqlite3)2. Create feature branch (`git checkout -b feature/amazing-feature`)

- Production: PostgreSQL recommended3. Commit changes (`git commit -m 'Add amazing feature'`)

- Migrations tracked in `backend_django/api/migrations/`4. Push to branch (`git push origin feature/amazing-feature`)

5. Open Pull Request

---

## License

## 📊 Database Models

MIT

### **User**

- `user_id` (PK), `username`, `email`, `password`## Contact

- `display_name`, `role`, `semester`, `department`

- `bio`, `specialization`, `created_at`For questions or issues, create an issue in the repository.


### **Subject**
- `subject_code` (PK), `subject_name`, `semester`

### **Topic**
- `topic_name`, `subject` (FK), `importance_score`
- Unique constraint: (topic_name, subject)

### **Resource**
- `resource_id` (PK), `topic_name`, `subject` (FK)
- `resource_type`, `title`, `description`
- `file_path`, `video_url`, `uploaded_by` (FK)
- `rating_avg`, `created_at`

### **Rating**
- `rating_id` (PK), `resource` (FK), `user` (FK)
- `rating_value`, `created_at`
- Unique constraint: (resource, user)

### **ImportantTopic**
- `flag_id` (PK), `topic_name`, `subject` (FK), `created_by` (FK)
- `reason`, `created_at`
- Unique constraint: (topic_name, subject, created_by)

---

## 🚦 Deployment

### **Frontend (Vercel/Netlify)**
```bash
npm run build
# Deploy the 'dist' folder
```

### **Backend (Heroku/Railway/DigitalOcean)**
```bash
# Configure environment variables
# Set DEBUG=False
# Configure PostgreSQL database
# Set ALLOWED_HOSTS
# Collect static files
python manage.py collectstatic
```

---

## 📝 Environment Variables

### **Frontend**
```env
VITE_API_URL=http://localhost:5001/api
```

### **Backend**
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8080
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for students and educators
- shadcn/ui for the beautiful component library
- Tailwind CSS for the styling system
- Django and React communities for excellent documentation

---

## 📞 Support

For questions, issues, or feature requests:
- Create an issue in the repository
- Check existing documentation in [SETUP.md](./SETUP.md)
- Review the [Product Requirements Document](./LearnLink-PRD.md)

---

**Happy Learning! 🎉**
