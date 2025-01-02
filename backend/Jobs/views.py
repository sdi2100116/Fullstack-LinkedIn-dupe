from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Job,Application
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import JobSerializer,ApplicationSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from api.services.create_job_matrix import load_matrix
import numpy as np
from rest_framework.pagination import LimitOffsetPagination  # Import default pagination

class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        user_skills = user.profile.skills.all()

        # Filter jobs based on user skills and creator
        query = Q()
        query |= Q(creator=user)

        if user_skills:
            skill_query = Q()
            for skill in user_skills:
                skill_query |= Q(skills__icontains=skill.name)
            query |= skill_query

        # Base jobs filtered by user skills or creator
        base_jobs = Job.objects.filter(query).distinct().order_by('-created_at')

        # Initialize a list to hold job IDs
        all_job_ids = list(base_jobs.values_list('id', flat=True))

        # Load the predicted matrix and add top 10 recommended jobs
        try:
            predicted_matrix = load_matrix()  # Load the prediction matrix
        except FileNotFoundError:
            predicted_matrix = None  # If no matrix, set it to None

        if predicted_matrix is not None:
            user_index = user.id  # Assuming user.id corresponds to the matrix row index

            if user_index < predicted_matrix.shape[0]:  # Check if user index is valid
                # Get the user's predicted jobs
                user_predictions = predicted_matrix[user_index]
                top_job_indices = np.argsort(user_predictions)[::-1]  # Sort jobs by prediction score (descending)
                top_job_ids = top_job_indices[:10]  # Get top 10 recommended jobs

                # Exclude already included jobs from the recommendations
                recommended_job_ids = Job.objects.filter(id__in=top_job_ids).exclude(id__in=all_job_ids).values_list('id', flat=True)

                # Add recommended job IDs to the list
                all_job_ids += list(recommended_job_ids)

        # Fetch all jobs by IDs
        all_jobs = Job.objects.filter(id__in=all_job_ids).order_by('-created_at')

        return all_jobs

    def list(self, request, *args, **kwargs):
        # Get all relevant jobs
        all_jobs = self.get_queryset()

        # Paginate the jobs
        paginator = LimitOffsetPagination()
        paginated_jobs = paginator.paginate_queryset(all_jobs, request)

        # Serialize the paginated jobs
        serializer = self.get_serializer(paginated_jobs, many=True)

        # Return paginated response
        return paginator.get_paginated_response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job(request, job_id):
    user = request.user  
    try:
        job = Job.objects.get(id=job_id)  
        
        if job.creator != user:
            return Response({"error": "You do not have permission to delete this post."}, status=status.HTTP_403_FORBIDDEN)
        
        job.delete()  
        return Response({"message": "Post has been successfully deleted."}, status=status.HTTP_200_OK)
    
    except Job.DoesNotExist:
        return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CreateApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id, *args, **kwargs):
        user = request.user
        job = get_object_or_404(Job, id=job_id)
        
        # Check if the application already exists
        application, created = Application.objects.get_or_create(user=user, job=job)

        if not created:
            return Response(
                {'message': 'You have already applied for this job.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        

        return Response({'job_id': job_id}, status=status.HTTP_200_OK)


class JobApplicantsView(APIView):
    def get(self, request, job_id):
        job = get_object_or_404(Job, id=job_id)
        applications = Application.objects.filter(job=job)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)