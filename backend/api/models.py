from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from PersonalData.models import Skills, Education, Experience

class User(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
            return self.username



class Profile(models.Model):
    user = models.OneToOneField(User, max_length=8,on_delete=models.CASCADE)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=10, blank=True, null=True)
    photo = models.ImageField(upload_to='profile_images/', blank=True, null=True ,default='profile_images/no_photo.jpg')
    skills = models.ManyToManyField(Skills, blank=True)
    education = models.ManyToManyField(Education, blank=True)
    experience = models.ManyToManyField(Experience, blank=True)
    bio=models.TextField(blank=True,default='no bio')
    
    def __str__(self):
            return self.user.username  

def create_user_profile(sender,instance,created,**kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender,instance,**kwargs):
    instance.profile.save()

post_save.connect(create_user_profile,sender=User)
post_save.connect(save_user_profile,sender=User)


class Connection(models.Model):
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    from_user = models.ForeignKey(User, related_name='connections_from', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='connections_to', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        
        unique_together = ('from_user', 'to_user')