from rest_framework import generics, permissions
from .models import Skills,Education,Experience
from .serializer import SkillsSerializer,EducationSerializer,ExperienceSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response

from django.core.exceptions import PermissionDenied
from api.models import Profile


class SkillsView(generics.CreateAPIView):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer
    permission_classes = [IsAuthenticated]  

    def perform_create(self, serializer):
        
        skill = serializer.save()

        user = self.request.user

        profile, created = Profile.objects.get_or_create(user=user)

        if isinstance(profile, Profile): 
            profile.skills.add(skill)
        else:
            raise ValueError("Profile object was not retrieved correctly.")


class EducationView(generics.CreateAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = ([AllowAny])  

    def perform_create(self, serializer):
        
        education = serializer.save()

        user = self.request.user

        profile, created = Profile.objects.get_or_create(user=user)

        if isinstance(profile, Profile): 
            profile.education.add(education)
        else:
            raise ValueError("Profile object was not retrieved correctly.")


class ExperienceView(generics.CreateAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = ([AllowAny])  

    def perform_create(self, serializer):
        
        experience = serializer.save()

        user = self.request.user

        profile, created = Profile.objects.get_or_create(user=user)

        if isinstance(profile, Profile): 
            profile.experience.add(experience)
        else:
            raise ValueError("Profile object was not retrieved correctly.")
        
        
        

        



class SkillCreateView(generics.CreateAPIView):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer
    permission_classes = ([AllowAny])

    def perform_create(self, serializer):
        
        serializer.save()

        
        