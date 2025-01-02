from api.models import User, Profile, Connection

from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id','username','email']



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['name'] = user.profile.first_name
        token['last_name'] = user.profile.last_name
        token['username'] = user.username
        token['email'] = user.email
        token['phone_number'] = user.profile.phone_number
        token['photo'] = str(user.profile.photo)

        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    phone_number = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)
    photo = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2','phone_number','first_name','last_name','photo')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        
        photo = validated_data.get('photo', 'profile_images/default.jpg')
        
        # Create User
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        # Check if a Profile already exists for the user
        profile, created = Profile.objects.get_or_create(
        user=user,
        defaults={
            'phone_number': validated_data['phone_number'],
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
            'photo': photo 

        }
    )

    
        if not created:
            
            profile.phone_number = validated_data['phone_number']
            profile.first_name = validated_data['first_name']
            profile.last_name = validated_data['last_name']
            if 'photo' in validated_data:
                profile.photo = photo
            profile.save()


        
        return user

    
class ConnectionSerializer(serializers.ModelSerializer):
    from_user = UserSerializer()
    to_user = UserSerializer()
    class Meta:
        model = Connection
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'phone_number', 'photo','bio']  

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)  

    class Meta:
        model = User
        fields = ['id', 'username', 'profile']  