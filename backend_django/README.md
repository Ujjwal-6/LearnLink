# LearnLink Django Backend

Complete Django REST API backend with SQLite database for the LearnLink application.

## ✅ Features

- **SQLite Database** - No external database setup required
- **REST API** - Full API for subjects, topics, resources, analytics, and profiles
- **File Uploads** - Support for uploading resource files
- **CORS Enabled** - Works seamlessly with React frontend on port 8080
- **Seeded Data** - 8 resources, 6 subjects, 16 topics, 5 users pre-loaded

## 🚀 Quick Start

### 1. Start the Backend (Port 5001)

```bash
cd backend_django
source venv/bin/activate
python manage.py runserver 5001
```

Or use the run script:
```bash
cd backend_django
chmod +x run.sh
./run.sh
```

### 2. Start the Frontend (Port 8080)

```bash
cd ..
npm run dev
```

### 3. Test the Application

Open http://localhost:8080 in your browser and:
- View subjects and topics
- Browse resources
- Upload new resources (they persist in SQLite!)
- View user profiles

## 📡 API Endpoints

All endpoints are available at `http://localhost:5001/api/`

### Health Check
- `GET /api/health` - Server status

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:code` - Get specific subject

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics?subject_code=CS101` - Filter by subject
- `GET /api/topics/important` - Get important topics

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources?topic_name=Recursion` - Filter by topic
- `GET /api/resources?sort=top` - Sort by rating
- `GET /api/resources/:id` - Get specific resource
- `POST /api/resources/upload` - Upload new resource (FormData)
- `POST /api/resources/:id/rate` - Rate a resource

### Analytics
- `GET /api/analytics` - Get topic weights and top resources

### Profile
- `GET /api/profile/:userId` - Get user profile with uploads

## 🗄️ Database Management

### Reset and Reseed Database

```bash
cd backend_django
source venv/bin/activate

# Delete existing database
rm db.sqlite3

# Run migrations
python manage.py migrate

# Seed with test data
python manage.py seed_db
```

### View Database

```bash
python manage.py dbshell
```

## 🔧 Tech Stack

- **Django 4.2.25** - Web framework
- **Django REST Framework** - API toolkit
- **SQLite** - Database
- **django-cors-headers** - CORS support
- **Pillow** - Image handling

## 📝 Seeded Data

The database comes pre-loaded with:
- **5 Users**: john_doe, jane_smith, alex_wilson, sarah_jones, mike_brown
- **6 Subjects**: CS101, CS102, CS201, CS202, MATH101, MATH201
- **16 Topics**: Recursion, Linked Lists, Sorting Algorithms, etc.
- **8 Resources**: Notes, videos, tutorials, and past papers

## ✨ Frontend Integration

The frontend at `http://localhost:8080` automatically connects to this backend. All uploads, ratings, and data changes persist in the SQLite database.

### Upload a Resource from Frontend

1. Go to http://localhost:8080/upload
2. Select subject (e.g., CS101)
3. Enter topic name (e.g., "Variables")
4. Choose resource type (note/video/tutorial/past_paper)
5. Fill in title and description
6. Click Upload

The resource will be saved to the database and immediately visible!

## 🎯 All Endpoints Verified Working

✅ Health check  
✅ Get subjects (6 subjects)  
✅ Get topics (16 topics)  
✅ Get resources (8 → 9 after upload)  
✅ Upload resource (tested via curl)  
✅ Get profile (user data with uploads)  
✅ CORS enabled for frontend  
✅ SQLite persistence working  

## 🐛 Troubleshooting

**Port 5001 already in use:**
```bash
lsof -ti:5001 | xargs kill -9
```

**Frontend can't connect:**
- Ensure backend is running on port 5001
- Check CORS settings in `learnlink_backend/settings.py`
- Verify frontend is on port 8080

**Database issues:**
```bash
# Reset everything
rm db.sqlite3
python manage.py migrate
python manage.py seed_db
```

## 🎉 You're All Set!

Both frontend and backend are now working perfectly with real database persistence!
