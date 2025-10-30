#!/bin/bash

echo "🚀 Starting LearnLink Django Backend..."
cd "$(dirname "$0")"

# Activate virtual environment
source venv/bin/activate

# Start server on port 5001
echo "✅ Starting Django server on http://localhost:5001"
python manage.py runserver 5001
