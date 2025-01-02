from rest_framework import generics, permissions
from .models import Post,Comment,Interest,View
from .serializer import PostSerializer,CommentSerializer
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.views import APIView
from api import views,models
from rest_framework import serializers,status
from django.shortcuts import get_object_or_404
from Notifications.models import PostNotification
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import LimitOffsetPagination
import numpy as np
from api.services.create_int_matrix import load_matrix


class PostView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = ([IsAuthenticated])  

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)





class PostViewF(APIView):
    def get(self, request):
        user = request.user
        
        # Fetch connected users' posts
        connected_profiles = views.get_connected_profiles(user)
        connected_users = models.User.objects.filter(profile__in=connected_profiles)
        posts_from_connected_users = Post.objects.filter(author__in=connected_users)
        
        # Fetch the current user's own posts
        posts_by_current_user = Post.objects.filter(author=user)

        try:
            predicted_matrix = load_matrix()  # Load predicted matrix
        except FileNotFoundError:  # Handle case where matrix doesn't exist
            predicted_matrix = None
        
        # Get viewed posts
        viewed_post_ids = View.objects.filter(user=user).values_list('post_id', flat=True)

        # Check if the predicted_matrix exists and user index is within bounds
        if predicted_matrix is not None and user.id < predicted_matrix.shape[0]:
            user_predictions = predicted_matrix[user.id]
            top_indices = np.argsort(user_predictions)[::-1]
            top_posts_ids = top_indices[:10]  # Get the top 10 recommended post IDs

            # Fetch recommended posts, excluding those already viewed
            top_posts = Post.objects.filter(id__in=top_posts_ids).exclude(id__in=viewed_post_ids).order_by('-created_at')
        else:
            # If no matrix or user index is out of bounds, return no recommended posts
            top_posts = Post.objects.none()

        # Combine posts
        all_posts = (posts_from_connected_users | posts_by_current_user | top_posts).distinct().order_by('-created_at')

        # Exclude posts already viewed
        all_posts = all_posts.exclude(id__in=viewed_post_ids)

        # Paginate results
        paginator = LimitOffsetPagination()
        paginated_posts = paginator.paginate_queryset(all_posts, request)
        
        # Serialize posts
        serializer = PostSerializer(paginated_posts, many=True)
        posts_data = serializer.data
        
        # Mark whether each post is liked by the user
        for post in posts_data:
            post_id = post['id']
            post['liked'] = Interest.objects.filter(post_id=post_id, user=user).exists()
        
        return paginator.get_paginated_response(posts_data)




@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    user = request.user  
    try:
        post = Post.objects.get(id=post_id)  
        
        if post.author != user:
            return Response({"error": "You do not have permission to delete this post."}, status=status.HTTP_403_FORBIDDEN)
        
        post.delete()  
        return Response({"message": "Post has been successfully deleted."}, status=status.HTTP_200_OK)
    
    except Post.DoesNotExist:
        return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CommentView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    
    def get_queryset(self):
        
        post_id = self.kwargs.get('post_id')
        if post_id:
            return Comment.objects.filter(post__id=post_id) 
        raise serializers.ValidationError("Post ID is required")

    
    def perform_create(self, serializer):
        
        serializer.save(comment_author=self.request.user)
        
        
        post_id = self.kwargs.get('post_id')  
        if post_id:
            try:
                post = Post.objects.get(id=post_id)
                serializer.instance.post = post  
                serializer.instance.save()

                PostNotification.objects.create(
                    user=post.author,  
                    post=post,
                    message=f'{self.request.user.username} commented on your post'
                )

            except Post.DoesNotExist:
                raise serializers.ValidationError("Post not found")
        else:
            raise serializers.ValidationError("Post ID is required")

class InterestView(APIView):

    def post(self, request, post_id, *args, **kwargs):
        user = request.user
        post = get_object_or_404(Post, id=post_id)

        # Create or delete the interest
        interest, created = Interest.objects.get_or_create(user=user, post=post)

        if not created:
            interest.delete()  
            liked = False
        else:
            liked = True
            # Create notification only when the post is liked
            PostNotification.objects.create(
                user=post.author,  
                post=post,
                message=f'{user.username} liked your post'
            )

        return Response({'liked': liked, 'post_id': post_id}, status=status.HTTP_200_OK)



class RecordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        try:
            post = Post.objects.get(id=post_id)
            
            # Check if the user is the author of the post
            if post.author == user:
                return Response({"message": "Author cannot record a view for their own post"}, status=400)

            # If the user is not the author, create the view record
            View.objects.create(user=user, post=post)
            return Response({"message": "Post view recorded successfully"}, status=200)
        
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=404)
