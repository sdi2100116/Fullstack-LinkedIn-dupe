from django.shortcuts import render
from api.models import Profile,User,Connection
from rest_framework.response import Response
from api.serializer import RegisterSerializer, MyTokenObtainPairSerializer, ConnectionSerializer, UserSerializer,ProfileSerializer
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import update_session_auth_hash
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from Notifications.models import ConnectionNotification
from email_validator import validate_email, EmailNotValidError
from api.services.create_int_matrix import load_matrix
import numpy as np
from blogs.models import Post,View,Interest,Comment
from Jobs.models import Job
from blogs.serializer import PostSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)

class AllUsersView(APIView):
    def get(self, request):
        users = User.objects.exclude(username='admin').order_by('username')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = ([AllowAny])
    serializer_class = RegisterSerializer

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if request.method == "GET":
        context = f"Hey {request.user}, You are seeing a GET response"
        return Response({'response': context},status=status.HTTP_200_OK)
    elif request.method == "POST":
        text = request.POST.get("text")
        respond = f"Hey {request.user}, your text is {text}"
        return Response({'response': context},status=status.HTTP_200_OK)

    return Response({'response': context},status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_profile(request):
    user = request.user  # Get the currently authenticated user
    try:
        user.delete()  
        return Response({"message": "Your profile has been successfully deleted."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
def profile_bio_view(request, username):
    try:
        profile = Profile.objects.get(user__username=username)
    except Profile.DoesNotExist:
        return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if request.user.username != username:
            return Response({'detail': 'Not allowed to update this profile.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def connections_api_view(request):
    
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    connected_users = get_connected_profiles(user)

    profiles_data = [
        {
            "id": profile.user.id,
            "username": profile.user.username,
            "email": profile.user.email,
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "photo": request.build_absolute_uri(profile.photo.url) if profile.photo else None,
            "experience": list(profile.experience.values('id', 'work_name', 'job', 'start_date', 'end_date', 'is_public')) if profile.experience.exists() else []
        }
        for profile in connected_users
    ]
    
    return Response(profiles_data, status=status.HTTP_200_OK)

def get_connected_profiles(user):
    
    from_user_ids = Connection.objects.filter(from_user=user, status='accepted').values_list('to_user', flat=True)
    to_user_ids = Connection.objects.filter(to_user=user, status='accepted').values_list('from_user', flat=True)
    connected_user_ids = set(from_user_ids) | set(to_user_ids)
    profiles = Profile.objects.filter(user__id__in=connected_user_ids)
    
    return profiles


@api_view(['GET']) #get the connection status between 2 users
def connection_status_api_view(request, username):
    
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    user = request.user
    target_user = get_object_or_404(User, username=username)
    
    cstatus = get_connection_status(user, target_user)
    return Response({'connection_status': cstatus}, status=status.HTTP_200_OK)

def get_connection_status(user, target_user):
    
    try:
        connection = Connection.objects.get(from_user=user, to_user=target_user)
    except Connection.DoesNotExist:
        try:
            connection = Connection.objects.get(from_user=target_user, to_user=user)
        except Connection.DoesNotExist:
            return 'not_connected'
    
    return connection.status

@api_view(['POST'])
def send_request(request, username):
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    user = request.user
    target_user = get_object_or_404(User, username=username)

    # Check if a connection already exists
    connection = Connection.objects.filter(from_user=user, to_user=target_user).first()

    if connection:
        if connection.status == 'rejected':
            # Delete the rejected connection
            connection.delete()

    # Create a new connection with status 'pending'
    connection, created = Connection.objects.get_or_create(
        from_user=user,
        to_user=target_user,
        defaults={'status': 'pending'}
    )

    # Create a notification for the connection request
    ConnectionNotification.objects.create(
        connection=connection,
        answer=None
    )

    return Response({'status': 'Connection request sent'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_connections_number(request):
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    number_of_connections= get_connected_profiles(request.user).count()
    return Response({'number_of_connections': number_of_connections}, status=status.HTTP_200_OK)

def get_profile_by_username(request, username):
    profile = get_object_or_404(Profile, user__username=username)
    photo_url = profile.photo.url if profile.photo else None
    if photo_url and not photo_url.startswith('http'):
        photo_url = request.build_absolute_uri(photo_url)
    skills = list(profile.skills.values('id', 'name','is_public')) if profile.skills.exists() else []
    education = list(profile.education.values('id', 'school', 'degree', 'start_date', 'end_date','is_public')) if profile.education.exists() else []
    experience = list(profile.experience.values('id', 'work_name', 'job', 'start_date', 'end_date','is_public')) if profile.experience.exists() else []

    return JsonResponse({
        "id": profile.user.id,
        "username": profile.user.username,
        "email": profile.user.email,
        "first_name" : profile.first_name,
        "last_name": profile.last_name,
        "phone_number": profile.phone_number,
        "photo" :photo_url,
        "skills":skills,
        "education":education,
        "experience":experience,
        "bio":profile.bio
    })

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        
        current_password = data.get("current_password")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        if not user.check_password(current_password):
            return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "New passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({"error": "New password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        
        update_session_auth_hash(request, user)

        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)

class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        
        current_email = data.get("current_email")
        new_email = data.get("new_email")
        confirm_email = data.get("confirm_email")
        print(user.email)
        print(current_email)
        if user.email!=current_email:
            return Response({"error": "Current email is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        if new_email != confirm_email:
            return Response({"error": "The email do not match."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(new_email)
        except EmailNotValidError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        user.email = new_email
        user.save()

        
        update_session_auth_hash(request, user)

        return Response({"message": "Email updated successfully."}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_for_admin(request, user_id):
    user = get_object_or_404(User, id=user_id)

    profile = Profile.objects.get(user=user)

    photo_url = profile.photo.url if profile.photo else None
    if photo_url and not photo_url.startswith('http'):
        photo_url = request.build_absolute_uri(photo_url)
    skills = list(profile.skills.values('id', 'name','is_public')) if profile.skills.exists() else []
    education = list(profile.education.values('id', 'school', 'degree', 'start_date', 'end_date','is_public')) if profile.education.exists() else []
    experience = list(profile.experience.values('id', 'work_name', 'job', 'start_date', 'end_date','is_public')) if profile.experience.exists() else []

    posts = Post.objects.filter(author=user).values('id', 'title', 'body','created_at')

    interests = Interest.objects.filter(user=user).values('post__title', 'created_at')

    comments = Comment.objects.filter(comment_author=user).values('post__title', 'comment_body', 'created_at')

    jobs = Job.objects.filter(creator=user).values('id', 'title','description', 'created_at')


    response_data = {
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'name':profile.first_name,
            'last_name':profile.last_name,
            'phone':profile.phone_number,
            'bio':profile.bio
        },
        'skills':skills,
        'education':education,
        'experience':experience,
        'posts': list(posts),
        'interests': list(interests),
        'comments': list(comments),
        'jobs': list(jobs),
    }

    return Response(response_data)


#top-posts
@api_view(['GET'])
def top_posts_for_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    predicted_matrix = load_matrix()
    
    
    user_index = user_id 
    user_predictions = predicted_matrix[user_index]
    
    
    top_indices = np.argsort(user_predictions)[::-1]  
    top_posts_ids = top_indices[:20]  
    
    viewed_post_ids = View.objects.filter(user=user).values_list('post_id', flat=True)
    
    
    top_posts = Post.objects.filter(id__in=top_posts_ids).exclude(id__in=viewed_post_ids).order_by('-created_at')
    serializer = PostSerializer(top_posts, many=True)

    posts_data=serializer.data
    for post in posts_data:
        post_id = post['id']
        post['liked'] = Interest.objects.filter(post_id=post_id, user=user).exists()

    
    return Response(posts_data)