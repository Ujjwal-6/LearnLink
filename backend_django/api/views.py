from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Avg, Count
from .models import User, Subject, Topic, Resource, Rating, ImportantTopic
import uuid
import json
import hashlib
import secrets


def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password, hashed):
    """Verify password against hash"""
    return hash_password(password) == hashed


def create_session_token():
    """Create a secure session token"""
    return secrets.token_urlsafe(32)


# In-memory session storage (in production, use Redis or database)
sessions = {}


@api_view(['POST'])
def signup(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        display_name = data.get('display_name', '')
        role = data.get('role', 'student')
        semester = data.get('semester')
        department = data.get('department', '')
        
        # Validation
        if not username or not email or not password:
            return Response({'error': 'Username, email, and password are required'}, status=400)
        
        if len(password) < 6:
            return Response({'error': 'Password must be at least 6 characters'}, status=400)
        
        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=400)
        
        # Create user
        user_id = str(uuid.uuid4())[:8]
        hashed_password = hash_password(password)
        
        user = User.objects.create(
            user_id=user_id,
            username=username,
            email=email,
            password=hashed_password,
            display_name=display_name or username,
            role=role,
            semester=semester,
            department=department
        )
        
        # Create session
        session_token = create_session_token()
        sessions[session_token] = user_id
        
        return Response({
            'success': True,
            'token': session_token,
            'user': {
                'user_id': user.user_id,
                'username': user.username,
                'email': user.email,
                'display_name': user.display_name,
                'role': user.role,
                'semester': user.semester,
                'department': user.department
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def login(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)
        
        # Find user by username or email
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=username)
            except User.DoesNotExist:
                return Response({'error': 'Invalid credentials'}, status=401)
        
        # Verify password
        if not verify_password(password, user.password):
            return Response({'error': 'Invalid credentials'}, status=401)
        
        # Create session
        session_token = create_session_token()
        sessions[session_token] = user.user_id
        
        return Response({
            'success': True,
            'token': session_token,
            'user': {
                'user_id': user.user_id,
                'username': user.username,
                'email': user.email,
                'display_name': user.display_name,
                'role': user.role,
                'semester': user.semester,
                'department': user.department,
                'bio': user.bio,
                'specialization': user.specialization
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def logout(request):
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if token in sessions:
            del sessions[token]
        return Response({'success': True})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def get_current_user(request):
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if token not in sessions:
            return Response({'error': 'Not authenticated'}, status=401)
        
        user_id = sessions[token]
        user = User.objects.get(user_id=user_id)
        
        return Response({
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'display_name': user.display_name,
            'role': user.role,
            'semester': user.semester,
            'department': user.department,
            'bio': user.bio,
            'specialization': user.specialization
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok'})


@api_view(['GET'])
def get_subjects(request):
    subjects = Subject.objects.all().values('subject_code', 'subject_name', 'semester')
    return Response(list(subjects))


@api_view(['GET'])
def get_subject(request, code):
    try:
        subject = Subject.objects.get(subject_code=code)
        return Response({
            'subject_code': subject.subject_code,
            'subject_name': subject.subject_name,
            'semester': subject.semester
        })
    except Subject.DoesNotExist:
        return Response({'error': 'Subject not found'}, status=404)


@api_view(['GET'])
def get_topics(request):
    subject_code = request.GET.get('subject_code')
    if subject_code:
        topics = Topic.objects.filter(subject__subject_code=subject_code)
    else:
        topics = Topic.objects.all()
    
    result = [{
        'topic_name': t.topic_name,
        'subject_code': t.subject.subject_code,
        'created_at': t.created_at.isoformat(),
        'importance_score': t.importance_score
    } for t in topics]
    
    return Response(result)


@api_view(['GET'])
def get_important_topics(request):
    topics = Topic.objects.filter(importance_score__gt=0).order_by('-importance_score')
    
    result = [{
        'topic_name': t.topic_name,
        'subject_code': t.subject.subject_code,
        'created_at': t.created_at.isoformat(),
        'importance_score': t.importance_score
    } for t in topics]
    
    return Response(result)


@api_view(['POST'])
@csrf_exempt
def mark_topic_important(request):
    try:
        data = json.loads(request.body)
        topic_name = data.get('topic_name')
        subject_code = data.get('subject_code')
        created_by = data.get('created_by')
        reason = data.get('reason', '')
        
        subject = Subject.objects.get(subject_code=subject_code)
        user = User.objects.get(user_id=created_by)
        
        # Check if user already marked this topic as important
        important_topic, created = ImportantTopic.objects.get_or_create(
            topic_name=topic_name,
            subject=subject,
            created_by=user,
            defaults={
                'flag_id': str(uuid.uuid4()),
                'reason': reason
            }
        )
        
        # Only increment importance score if this is a new flag
        if created:
            topic = Topic.objects.filter(topic_name=topic_name, subject=subject).first()
            if topic:
                topic.importance_score = min(10, topic.importance_score + 0.5)
                topic.save()
            return Response({'success': True, 'new_importance_score': topic.importance_score if topic else 0, 'already_marked': False})
        else:
            topic = Topic.objects.filter(topic_name=topic_name, subject=subject).first()
            return Response({'success': True, 'new_importance_score': topic.importance_score if topic else 0, 'already_marked': True})
    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
def get_resources(request):
    topic_name = request.GET.get('topic_name')
    sort = request.GET.get('sort')
    subject_code = request.GET.get('subject_code') or request.GET.get('subject')
    
    resources = Resource.objects.select_related('uploaded_by', 'subject')
    
    # Filter by topic if provided
    if topic_name:
        resources = resources.filter(topic_name=topic_name)
    # Filter by subject code if provided
    if subject_code:
        resources = resources.filter(subject__subject_code=subject_code)
    
    if sort == 'top':
        resources = resources.order_by('-rating_avg')
    elif sort == 'recent':
        resources = resources.order_by('-created_at')
    
    result = [{
        'resource_id': r.resource_id,
        'topic_name': r.topic_name,
        'subject_code': r.subject.subject_code,
        'resource_type': r.resource_type,
        'title': r.title,
        'description': r.description,
        'file_path': r.file_path,
        'video_url': r.video_url,
        'uploaded_by': {
            'user_id': r.uploaded_by.user_id,
            'username': r.uploaded_by.username
        },
        'rating_avg': r.rating_avg,
        'created_at': r.created_at.isoformat()
    } for r in resources]
    
    return Response(result)


@api_view(['GET'])
def get_resource(request, resource_id):
    try:
        r = Resource.objects.select_related('uploaded_by', 'subject').get(resource_id=resource_id)
        return Response({
            'resource_id': r.resource_id,
            'topic_name': r.topic_name,
            'subject_code': r.subject.subject_code,
            'resource_type': r.resource_type,
            'title': r.title,
            'description': r.description,
            'file_path': r.file_path,
            'video_url': r.video_url,
            'uploaded_by': {
                'user_id': r.uploaded_by.user_id,
                'username': r.uploaded_by.username
            },
            'rating_avg': r.rating_avg,
            'created_at': r.created_at.isoformat()
        })
    except Resource.DoesNotExist:
        return Response({'error': 'Resource not found'}, status=404)


@api_view(['POST'])
@csrf_exempt
def upload_resource(request):
    try:
        subject_code = request.POST.get('subject_code') or request.data.get('subject_code')
        topic_name = request.POST.get('topic_name') or request.data.get('topic_name')
        resource_type = request.POST.get('resource_type') or request.data.get('resource_type')
        title = request.POST.get('title') or request.data.get('title')
        description = request.POST.get('description') or request.data.get('description')
        uploaded_by = request.POST.get('uploaded_by') or request.data.get('uploaded_by')
        video_url = request.POST.get('video_url') or request.data.get('video_url')
        file = request.FILES.get('file')
        
        if not all([subject_code, topic_name, resource_type, title, description, uploaded_by]):
            return Response({
                'error': 'Missing required fields: subject_code, topic_name, resource_type, title, description, uploaded_by'
            }, status=400)
        
        subject, _ = Subject.objects.get_or_create(
            subject_code=subject_code,
            defaults={'subject_name': subject_code, 'semester': 1}
        )
        
        user, _ = User.objects.get_or_create(
            user_id=uploaded_by,
            defaults={'username': uploaded_by}
        )
        
        file_path = None
        if file:
            file_path = f'/uploads/{file.name}'
        
        resource = Resource.objects.create(
            resource_id=str(uuid.uuid4()),
            topic_name=topic_name,
            subject=subject,
            resource_type=resource_type,
            title=title,
            description=description,
            file_path=file_path,
            video_url=video_url if video_url else None,
            uploaded_by=user,
            rating_avg=0
        )
        
        Topic.objects.get_or_create(
            topic_name=topic_name,
            subject=subject,
            defaults={'importance_score': 0}
        )
        
        return Response({
            'resource_id': resource.resource_id,
            'topic_name': resource.topic_name,
            'subject_code': resource.subject.subject_code,
            'resource_type': resource.resource_type,
            'title': resource.title,
            'description': resource.description,
            'file_path': resource.file_path,
            'video_url': resource.video_url,
            'uploaded_by': {
                'user_id': user.user_id,
                'username': user.username
            },
            'rating_avg': resource.rating_avg,
            'created_at': resource.created_at.isoformat()
        }, status=201)
        
    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['POST'])
@csrf_exempt
def rate_resource(request, resource_id):
    try:
        data = json.loads(request.body)
        rating_value = data.get('rating') or data.get('rating_value')
        user_id = data.get('user_id', 'u1')
        
        if not rating_value:
            return Response({'error': 'Rating value is required'}, status=400)
        
        resource = Resource.objects.get(resource_id=resource_id)
        user, _ = User.objects.get_or_create(user_id=user_id, defaults={'username': user_id})
        
        rating, created = Rating.objects.update_or_create(
            resource=resource,
            user=user,
            defaults={'rating_value': rating_value}
        )
        
        avg_rating = Rating.objects.filter(resource=resource).aggregate(Avg('rating_value'))['rating_value__avg']
        resource.rating_avg = round(avg_rating, 2) if avg_rating else 0
        resource.save()
        
        return Response({
            'success': True,
            'new_avg_rating': resource.rating_avg,
            'is_new_rating': created,
            'user_rating': rating_value
        })
        
    except Resource.DoesNotExist:
        return Response({'error': 'Resource not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
def get_analytics(request):
    topics = Topic.objects.order_by('-importance_score')[:10]
    topic_weights = [{
        'topic_name': t.topic_name,
        'weight': t.importance_score
    } for t in topics]
    
    resources = Resource.objects.order_by('-rating_avg')[:5]
    top_resources = [{
        'resource_id': r.resource_id,
        'title': r.title,
        'rating_avg': r.rating_avg
    } for r in resources]
    
    return Response({
        'topic_weights': topic_weights,
        'top_resources': top_resources
    })


@api_view(['GET'])
def get_profile(request, user_id):
    try:
        user = User.objects.get(user_id=user_id)
        
        resources = Resource.objects.filter(uploaded_by=user).select_related('subject').order_by('-created_at')[:5]
        recent_uploads = [{
            'resource_id': r.resource_id,
            'title': r.title,
            'description': r.description,
            'topic_name': r.topic_name,
            'subject_code': r.subject.subject_code,
            'resource_type': r.resource_type,
            'rating_avg': r.rating_avg,
            'file_path': r.file_path,
            'video_url': r.video_url,
            'uploaded_by': {
                'user_id': user.user_id,
                'username': user.username
            },
            'created_at': r.created_at.isoformat()
        } for r in resources]
        
        total_ratings = sum([r.rating_avg for r in Resource.objects.filter(uploaded_by=user)])
        
        return Response({
            'user_id': user.user_id,
            'username': user.username,
            'display_name': user.display_name,
            'role': user.role,
            'semester': user.semester,
            'department': user.department,
            'bio': user.bio,
            'specialization': user.specialization,
            'uploads_count': Resource.objects.filter(uploaded_by=user).count(),
            'total_ratings': total_ratings,
            'recent_uploads': recent_uploads
        })
        
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['PUT', 'PATCH'])
@csrf_exempt
def update_profile(request, user_id):
    try:
        user = User.objects.get(user_id=user_id)
        data = json.loads(request.body)
        
        # Update allowed fields
        if 'display_name' in data:
            user.display_name = data['display_name']
        if 'bio' in data:
            user.bio = data['bio']
        if 'department' in data:
            user.department = data['department']
        if 'semester' in data:
            user.semester = data['semester']
        if 'specialization' in data:
            user.specialization = data['specialization']
        
        user.save()
        
        return Response({
            'success': True,
            'user': {
                'user_id': user.user_id,
                'username': user.username,
                'email': user.email,
                'display_name': user.display_name,
                'role': user.role,
                'semester': user.semester,
                'department': user.department,
                'bio': user.bio,
                'specialization': user.specialization
            }
        })
        
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

