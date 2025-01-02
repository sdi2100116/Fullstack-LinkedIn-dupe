from django.apps import AppConfig
from django.db.models.signals import post_migrate


class YourAppConfig(AppConfig):
    name = 'api'

    def ready(self):
        post_migrate.connect(create_periodic_task, sender=self)

def create_periodic_task(sender, **kwargs):
    # Create or get the interval schedule
    from django.utils import timezone
    from django_celery_beat.models import PeriodicTask, IntervalSchedule
    schedule, created = IntervalSchedule.objects.get_or_create(
        every=10,
        period=IntervalSchedule.HOURS,
    )

    # Create or update the periodic task
    PeriodicTask.objects.update_or_create(
        interval=schedule,
        name='Run generate_matrix every 10 hours',
        task='api.tasks.run_generate_matrix',
        defaults={
            'expires': timezone.now() + timezone.timedelta(hours=10),
        }
    )