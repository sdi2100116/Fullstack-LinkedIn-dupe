from PersonalData.models import Skills,Education,Experience

from rest_framework import serializers

class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = '__all__'

    def create(self, validated_data):
        skill = Skills.objects.create(**validated_data)
        return skill

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

    def create(self, validated_data):
        education = Education.objects.create(**validated_data)
        return education


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

    def create(self, validated_data):
        experience = Experience.objects.create(**validated_data)
        return experience