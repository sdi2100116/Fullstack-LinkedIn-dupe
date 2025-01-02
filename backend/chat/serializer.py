from rest_framework import serializers
from api.serializer import UserSerializer
from .models import Conversation,Message



class ConversationSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    class Meta:
        model = Conversation
        fields = ['id', 'user1', 'user2', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    conversation=ConversationSerializer(read_only=True)
    sender = UserSerializer(read_only=True)
    

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'timestamp']

