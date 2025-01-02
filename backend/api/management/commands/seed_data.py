from django.core.management.base import BaseCommand
from faker import Faker
from django.contrib.auth.hashers import make_password
from api.models import User, Profile, Connection  # Ensure these are the correct imports
from PersonalData.models import Skills, Education, Experience
from blogs.models import Post, Comment, Interest
from Jobs.models import Job, Application
from chat.models import Message, Conversation


class Command(BaseCommand):
    help = 'Seed the database with fake data for users, profiles, skills, education, experience, and connections'

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Seed Skills
        for _ in range(10):  # Reduced the number of records
            Skills.objects.get_or_create(
                name=fake.word(),
                defaults={'is_public': fake.boolean()}
            )

        # Seed Education
        for _ in range(10):  # Reduced the number of records
            Education.objects.get_or_create(
                school=fake.company(),
                degree=fake.word(),
                start_date=fake.date(),
                end_date=fake.date_this_decade(),
                defaults={'is_public': fake.boolean()}
            )

        # Seed Experience
        for _ in range(10):  # Reduced the number of records
            Experience.objects.get_or_create(
                work_name=fake.company(),
                job=fake.job(),
                start_date=fake.date(),
                end_date=fake.date_this_decade(),
                defaults={'is_public': fake.boolean()}
            )

        # Seed Users and Profiles
        for _ in range(10):  # Reduced the number of records
            user, created = User.objects.get_or_create(
                username=fake.user_name(),
                defaults={
                    'email': fake.email(),
                    'password': make_password(fake.password())
                }
            )
            profile, profile_created = Profile.objects.get_or_create(
                user=user,
                defaults={
                    'first_name': fake.first_name(),
                    'last_name': fake.last_name(),
                    'phone_number': fake.phone_number(),
                    'photo': 'profile_images/no_photo.jpg'
                }
            )
            if not profile_created:
                # Update existing profile with new data
                profile.first_name = fake.first_name()
                profile.last_name = fake.last_name()
                profile.phone_number = fake.phone_number()
                profile.save()
                print(f'Profile updated for {user.username}')
            else:
                print(f'Profile created for {user.username}')

        # Seed Connections
        users = User.objects.all()
        for _ in range(10):  # Reduced the number of connections
            from_user = fake.random_element(users)
            to_user = fake.random_element(users)
            while from_user == to_user:
                to_user = fake.random_element(users)

            Connection.objects.get_or_create(
                from_user=from_user,
                to_user=to_user,
                defaults={'status': fake.random_element(['pending', 'accepted', 'rejected'])}
            )

        # Seed Posts, Comments, and Interests
        for _ in range(10):  # Reduced number of posts
            author = fake.random_element(users)
            post = Post.objects.create(
                title=fake.sentence(),
                author=author,
                body=fake.text(),
            )
            print(f'Created post: {post.title}')

            # Seed Comments for each post
            for _ in range(5):  # Adjust number of comments per post
                Comment.objects.create(
                    comment_author=fake.random_element(users),
                    comment_body=fake.sentence(),
                    post=post
                )
            print(f'Comments added for post: {post.title}')

            # Seed Interests for each post
            for _ in range(10):  # Adjust number of interests per post
                Interest.objects.create(
                    user=fake.random_element(users),
                    post=post
                )
            print(f'Interests added for post: {post.title}')

        # Seed Jobs and Applications
        for _ in range(10):  # Adjust the number of jobs
            creator = fake.random_element(users)
            job = Job.objects.create(
                title=fake.job(),
                description=fake.text(),
                company=fake.company(),
                location=fake.city(),
                image='profile_images/no_photo_corp.jpg',  # Placeholder
                creator=creator
            )
            print(f'Created job: {job.title}')

            # Seed Applications for each job
            for _ in range(5):  # Adjust number of applications per job
                Application.objects.create(
                    user=fake.random_element(users),
                    job=job
                )
            print(f'Applications added for job: {job.title}')

        # Seed Conversations and Messages
        for _ in range(10):  # Adjust the number of conversations
            user1 = fake.random_element(users)
            user2 = fake.random_element(users)
            while user1 == user2:
                user2 = fake.random_element(users)

            conversation, _ = Conversation.objects.get_or_create(
                user1=user1,
                user2=user2
            )

            for _ in range(5):  # Adjust number of messages per conversation
                Message.objects.create(
                    conversation=conversation,
                    sender=fake.random_element([user1, user2]),
                    content=fake.text()
                )
            print(f'Created conversation between {user1.username} and {user2.username} with messages.')

        # Output success message
        self.stdout.write(self.style.SUCCESS('Successfully seeded the database'))
