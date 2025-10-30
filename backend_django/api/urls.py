from django.urls import path
from . import views

urlpatterns = [
    path('health', views.health_check, name='health'),
    
    # Authentication
    path('auth/signup', views.signup, name='signup'),
    path('auth/login', views.login, name='login'),
    path('auth/logout', views.logout, name='logout'),
    path('auth/me', views.get_current_user, name='get_current_user'),
    
    # Subjects & Topics
    path('subjects', views.get_subjects, name='get_subjects'),
    path('subjects/<str:code>', views.get_subject, name='get_subject'),
    path('topics', views.get_topics, name='get_topics'),
    path('topics/important', views.mark_topic_important, name='mark_topic_important'),
    path('topics/important-list', views.get_important_topics, name='get_important_topics'),
    
    # Resources
    path('resources', views.get_resources, name='get_resources'),
    path('resources/upload', views.upload_resource, name='upload_resource'),
    path('resources/<str:resource_id>/rate', views.rate_resource, name='rate_resource'),
    path('resources/<str:resource_id>', views.get_resource, name='get_resource'),
    
    # Analytics & Profile
    path('analytics', views.get_analytics, name='get_analytics'),
    path('profile/<str:user_id>', views.get_profile, name='get_profile'),
    path('profile/<str:user_id>/update', views.update_profile, name='update_profile'),
]
