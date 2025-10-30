from django.core.management.base import BaseCommand
from api.models import User, Subject, Topic, Resource, Rating, ImportantTopic
import uuid


class Command(BaseCommand):
    help = 'Seed database with initial test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('🌱 Starting database seeding...')
        
        # Create users
        self.stdout.write('Creating users...')
        users_data = [
            {'user_id': 'u1', 'username': 'john_doe', 'role': 'student', 'semester': 3, 'department': 'Computer Science', 'bio': 'CS student passionate about algorithms'},
            {'user_id': 'u2', 'username': 'jane_smith', 'role': 'student', 'semester': 4, 'department': 'Computer Science', 'bio': 'Love sharing study materials!'},
            {'user_id': 'u3', 'username': 'alex_wilson', 'role': 'professor', 'department': 'Computer Science', 'bio': 'Assistant Professor of Algorithms', 'specialization': 'Algorithms'},
            {'user_id': 'u4', 'username': 'sarah_jones', 'role': 'student', 'semester': 2, 'department': 'Mathematics'},
            {'user_id': 'u5', 'username': 'mike_brown', 'role': 'student', 'semester': 5, 'department': 'Computer Science'},
        ]
        
        for user_data in users_data:
            User.objects.get_or_create(user_id=user_data['user_id'], defaults=user_data)
        
        # Create subjects
        self.stdout.write('Creating subjects...')
        subjects_data = [
            {'subject_code': 'CS101', 'subject_name': 'Introduction to Programming', 'semester': 1},
            {'subject_code': 'CS102', 'subject_name': 'Data Structures', 'semester': 2},
            {'subject_code': 'CS201', 'subject_name': 'Algorithms', 'semester': 3},
            {'subject_code': 'CS202', 'subject_name': 'Database Systems', 'semester': 4},
            {'subject_code': 'MATH101', 'subject_name': 'Calculus I', 'semester': 1},
            {'subject_code': 'MATH201', 'subject_name': 'Linear Algebra', 'semester': 3},
        ]
        
        for subject_data in subjects_data:
            Subject.objects.get_or_create(subject_code=subject_data['subject_code'], defaults=subject_data)
        
        # Create topics
        self.stdout.write('Creating topics...')
        topics_data = [
            {'topic_name': 'Variables and Data Types', 'subject_code': 'CS101', 'importance_score': 8.5},
            {'topic_name': 'Control Flow', 'subject_code': 'CS101', 'importance_score': 7.2},
            {'topic_name': 'Functions', 'subject_code': 'CS101', 'importance_score': 9.1},
            {'topic_name': 'Recursion', 'subject_code': 'CS101', 'importance_score': 9.8},
            {'topic_name': 'Arrays', 'subject_code': 'CS102', 'importance_score': 8.0},
            {'topic_name': 'Linked Lists', 'subject_code': 'CS102', 'importance_score': 8.7},
            {'topic_name': 'Stacks and Queues', 'subject_code': 'CS102', 'importance_score': 8.3},
            {'topic_name': 'Trees', 'subject_code': 'CS102', 'importance_score': 9.2},
            {'topic_name': 'Sorting Algorithms', 'subject_code': 'CS201', 'importance_score': 9.5},
            {'topic_name': 'Graph Algorithms', 'subject_code': 'CS201', 'importance_score': 9.0},
            {'topic_name': 'SQL Basics', 'subject_code': 'CS202', 'importance_score': 8.8},
            {'topic_name': 'Normalization', 'subject_code': 'CS202', 'importance_score': 8.4},
            {'topic_name': 'Limits', 'subject_code': 'MATH101', 'importance_score': 7.5},
            {'topic_name': 'Derivatives', 'subject_code': 'MATH101', 'importance_score': 8.9},
            {'topic_name': 'Matrix Operations', 'subject_code': 'MATH201', 'importance_score': 8.1},
            {'topic_name': 'Eigenvalues', 'subject_code': 'MATH201', 'importance_score': 8.6},
        ]
        
        for topic_data in topics_data:
            subject = Subject.objects.get(subject_code=topic_data['subject_code'])
            Topic.objects.get_or_create(
                topic_name=topic_data['topic_name'],
                subject=subject,
                defaults={'importance_score': topic_data['importance_score']}
            )
        
        # Create resources
        self.stdout.write('Creating resources...')
        resources_data = [
            {
                'resource_id': str(uuid.uuid4()),
                'topic_name': 'Recursion',
                'subject_code': 'CS101',
                'resource_type': 'note',
                'title': 'Complete Guide to Recursion',
                'description': 'Comprehensive notes covering base cases, recursive cases, and stack traces',
                'file_path': '/files/recursion-guide.pdf',
                'uploaded_by': 'u1',
                'rating_avg': 4.8,
            },
            {
                'resource_id': str(uuid.uuid4()),
                'topic_name': 'Recursion',
                'subject_code': 'CS101',
                'resource_type': 'video',
                'title': 'Recursion Explained Visually',
                'description': 'Video tutorial with animations showing how recursion works',
                'video_url': 'https://youtube.com/watch?v=example',
                'uploaded_by': 'u2',
                'rating_avg': 4.9,
            },
            {
                'resource_id': str(uuid.uuid4()),
                'topic_name': 'Linked Lists',
                'subject_code': 'CS102',
                'resource_type': 'tutorial',
                'title': 'Linked List Implementation Tutorial',
                'description': 'Step-by-step guide to implementing singly and doubly linked lists',
                'file_path': '/files/linked-lists-tutorial.pdf',
                'uploaded_by': 'u1',
                'rating_avg': 4.6,
            },
            {
                'resource_id': str(uuid.uuid4()),
                'topic_name': 'Sorting Algorithms',
                'subject_code': 'CS201',
                'resource_type': 'past_paper',
                'title': 'Sorting Algorithms Exam 2023',
                'description': 'Previous year exam paper with solutions',
                'file_path': '/files/sorting-exam-2023.pdf',
                'uploaded_by': 'u3',
                'rating_avg': 4.7,
            },
            {
                'resource_id': str(uuid.uuid4()),
                'topic_name': 'Graph Algorithms',
                'subject_code': 'CS201',
                'resource_type': 'video',
                'title': 'Graph Traversal Algorithms',
                'description': 'BFS and DFS explained with examples',
                'video_url': 'https://youtube.com/watch?v=graph',
                'uploaded_by': 'u2',
                'rating_avg': 4.5,
            },
            {
                'resource_id': str(uuid.uuid4()),
                'topic_name': 'SQL Basics',
                'subject_code': 'CS202',
                'resource_type': 'tutorial',
                'title': 'SQL Query Cheat Sheet',
                'description': 'Quick reference for common SQL commands',
                'file_path': '/files/sql-cheatsheet.pdf',
                'uploaded_by': 'u1',
                'rating_avg': 4.4,
            },
            {
                'resource_id': str(uuid.uuid4()),
                'topic_name': 'Derivatives',
                'subject_code': 'MATH101',
                'resource_type': 'note',
                'title': 'Differentiation Rules',
                'description': 'Common differentiation formulas and rules',
                'file_path': '/files/derivatives.pdf',
                'uploaded_by': 'u4',
                'rating_avg': 4.3,
            },
            {
                'resource_id': str(uuid.uuid4()),
                'topic_name': 'Matrix Operations',
                'subject_code': 'MATH201',
                'resource_type': 'tutorial',
                'title': 'Matrix Multiplication Guide',
                'description': 'Step-by-step matrix operations tutorial',
                'file_path': '/files/matrix-ops.pdf',
                'uploaded_by': 'u5',
                'rating_avg': 4.2,
            },
        ]
        
        for resource_data in resources_data:
            subject = Subject.objects.get(subject_code=resource_data['subject_code'])
            user = User.objects.get(user_id=resource_data['uploaded_by'])
            
            Resource.objects.get_or_create(
                resource_id=resource_data['resource_id'],
                defaults={
                    'topic_name': resource_data['topic_name'],
                    'subject': subject,
                    'resource_type': resource_data['resource_type'],
                    'title': resource_data['title'],
                    'description': resource_data['description'],
                    'file_path': resource_data.get('file_path'),
                    'video_url': resource_data.get('video_url'),
                    'uploaded_by': user,
                    'rating_avg': resource_data['rating_avg'],
                }
            )
        
        # Create ratings
        self.stdout.write('Creating ratings...')
        resources = Resource.objects.all()
        for resource in resources[:4]:
            for user_id in ['u1', 'u2', 'u3']:
                user = User.objects.get(user_id=user_id)
                if user != resource.uploaded_by:
                    Rating.objects.get_or_create(
                        resource=resource,
                        user=user,
                        defaults={'rating_id': str(uuid.uuid4()), 'rating_value': 5}
                    )
        
        self.stdout.write(self.style.SUCCESS('✅ Database seeding completed successfully!'))
        self.stdout.write(f'📊 Summary:')
        self.stdout.write(f'  - {User.objects.count()} users created')
        self.stdout.write(f'  - {Subject.objects.count()} subjects created')
        self.stdout.write(f'  - {Topic.objects.count()} topics created')
        self.stdout.write(f'  - {Resource.objects.count()} resources uploaded')
        self.stdout.write(f'  - {Rating.objects.count()} ratings added')
