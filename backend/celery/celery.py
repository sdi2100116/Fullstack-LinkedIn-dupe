# # celery/celery.py
# import os
# from celery import Celery

# # Set the default Django settings module for the 'celery' program.
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# # Create a Celery application instance.
# app = Celery('backend')

# # Load the Django settings for Celery.
# app.config_from_object('django.conf:settings', namespace='CELERY')

# # Set the timezone to UTC.
# app.conf.timezone = 'UTC'


# # Automatically discover tasks from all registered Django apps.
# app.autodiscover_tasks()
