from rest_framework import serializers
from .models import Post,Comment,Interest, View
from api.serializer import UserSerializer

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'title', 'body','author','created_at','image', 'audio', 'video']

    def create(self, validated_data):
        post = Post.objects.create(**validated_data)
        return post

    def get_liked(self, obj):
        user = self.context['request'].user
        return Interest.objects.filter(user=user, post=obj).exists()

class CommentSerializer(serializers.ModelSerializer):
    comment_author = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ['id','comment_body','comment_author','created_at','post']

    def create(self, validated_data):
        post = Comment.objects.create(**validated_data)
        return post

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['user', 'post', 'created_at']

class ViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = View
        fields = ['user', 'post', 'viewed_at']