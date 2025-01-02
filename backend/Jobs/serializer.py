from rest_framework import serializers
from .models import Job,Application
from api.serializer import UserSerializer

class JobSerializer(serializers.ModelSerializer):
    creator=UserSerializer(read_only=True)
    class Meta:
        model = Job
        fields = ['id','title', 'description', 'company', 'location','image','creator','skills']

class ApplicationSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model = Application
        fields = ['id', 'user', 'job']
        