from django.db import models
from api.models import Connection
from blogs.models import Post
from django.conf import settings
class ConnectionNotification(models.Model):
    connection = models.OneToOneField(Connection, on_delete=models.CASCADE)
    answer = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'{self.connection.from_user.username} -> {self.connection.to_user.username}'


class PostNotification(models.Model):
    
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 
    post = models.ForeignKey(Post, on_delete=models.CASCADE)  
    message = models.CharField(max_length=100) 
    created_at = models.DateTimeField(auto_now_add=True)  
    
    def __str__(self):
        return f" notification for {self.user.username} on post {self.post.id}"