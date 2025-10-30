import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnlink_backend.settings')
django.setup()

from api.models import User

# Create default user for uploads
user, created = User.objects.get_or_create(
    user_id='u1',
    defaults={
        'username': 'Default User',
        'role': 'student',
        'semester': 1,
        'department': 'General',
        'bio': 'Default user for LearnLink'
    }
)

if created:
    print(f"✅ Created default user: {user.username} (ID: {user.user_id})")
else:
    print(f"ℹ️  Default user already exists: {user.username} (ID: {user.user_id})")
