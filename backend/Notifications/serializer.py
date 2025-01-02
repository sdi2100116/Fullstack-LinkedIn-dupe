from rest_framework import serializers
from .models import ConnectionNotification,PostNotification
from api.serializer import ConnectionSerializer,UserSerializer
from blogs.serializer import PostSerializer

class ConnectionNotificationSerializer(serializers.ModelSerializer):
    connection= ConnectionSerializer()
    class Meta:
        model = ConnectionNotification
        fields = ['id', 'connection', 'answer', 'created_at']
        
class PostNotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer()  
    post = PostSerializer()
    class Meta:
        model = PostNotification
        fields = ['id', 'user', 'post', 'message', 'created_at']