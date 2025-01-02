from celery import Celery

# Use the correct path to your settings
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # Ensure this matches your project name

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

__all__ = ('app',)