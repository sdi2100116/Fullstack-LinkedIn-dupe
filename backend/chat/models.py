from django.db import models
from django.conf import settings
from django.utils import timezone


class Conversation(models.Model):
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversations_started")
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversations_received")
    created_at = models.DateTimeField(auto_now_add=True)
    latest_message_timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user1', 'user2')
        ordering = ['-latest_message_timestamp']

    def __str__(self):
        return f"Conversation between {self.user1.username} and {self.user2.username}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} in conversation {self.conversation.id}"

