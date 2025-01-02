from django.core.management.base import BaseCommand
from api.models import User

class Command(BaseCommand):
    help = 'List users and reset passwords'

    def handle(self, *args, **kwargs):
        
        users = User.objects.all()
        for user in users:
            print(f'Username: {user.username}, Email: {user.email}')
            # Optional: reset password for each user
            new_password = 'new_password'  # You can use any password here
            user.set_password(new_password)
            user.save()
            print(f'Password for user {user.username} reset to: {new_password}')