from django.db import models
import uuid

class User(models.Model):
    user_id = models.CharField(max_length=50, primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)  # Will store hashed password
    display_name = models.CharField(max_length=200, blank=True, null=True)
    role = models.CharField(max_length=50, default='student')
    semester = models.IntegerField(blank=True, null=True)
    department = models.CharField(max_length=200, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    specialization = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class Subject(models.Model):
    subject_code = models.CharField(max_length=20, primary_key=True)
    subject_name = models.CharField(max_length=200)
    semester = models.IntegerField()

    def __str__(self):
        return f"{self.subject_code} - {self.subject_name}"


class Topic(models.Model):
    topic_name = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, to_field='subject_code', db_column='subject_code')
    created_at = models.DateTimeField(auto_now_add=True)
    importance_score = models.FloatField(default=0)

    class Meta:
        unique_together = ('topic_name', 'subject')

    def __str__(self):
        return f"{self.topic_name} ({self.subject.subject_code})"


class Resource(models.Model):
    RESOURCE_TYPES = [
        ('note', 'Note'),
        ('video', 'Video'),
        ('past_paper', 'Past Paper'),
        ('tutorial', 'Tutorial'),
    ]

    resource_id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4)
    topic_name = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, to_field='subject_code', db_column='subject_code')
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    title = models.CharField(max_length=500)
    description = models.TextField()
    file_path = models.CharField(max_length=500, blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, to_field='user_id', db_column='uploaded_by')
    rating_avg = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Rating(models.Model):
    rating_id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4)
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, to_field='resource_id', db_column='resource_id')
    user = models.ForeignKey(User, on_delete=models.CASCADE, to_field='user_id', db_column='user_id')
    rating_value = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('resource', 'user')

    def __str__(self):
        return f"{self.user.username} rated {self.resource.title}: {self.rating_value}"


class ImportantTopic(models.Model):
    flag_id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4)
    topic_name = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, to_field='subject_code', db_column='subject_code')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, to_field='user_id', db_column='created_by')
    reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('topic_name', 'subject', 'created_by')

    def __str__(self):
        return f"{self.topic_name} - Important"
