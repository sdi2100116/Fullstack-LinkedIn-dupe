from django.core.management.base import BaseCommand
from django.db import transaction
from blogs.models import Interest

class Command(BaseCommand):
    help = 'Delete duplicate interests while keeping one instance.'

    def handle(self, *args, **kwargs):
        # Create a set to track seen interests
        seen_interests = set()
        duplicates = []

        # Get all interests
        interests = Interest.objects.all()

        for interest in interests:
            # Create a unique identifier for each interest (e.g., user and post combination)
            identifier = (interest.user.id, interest.post.id)
            if identifier in seen_interests:
                duplicates.append(interest)
            else:
                seen_interests.add(identifier)

        # Delete duplicates in a transaction
        with transaction.atomic():
            for interest in duplicates:
                interest.delete()
                self.stdout.write(self.style.SUCCESS(f'Deleted duplicate interest: {interest.id}'))

        self.stdout.write(self.style.SUCCESS(f'Deleted {len(duplicates)} duplicate interests.'))
