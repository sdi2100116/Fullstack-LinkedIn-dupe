from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation,Message
from .serializer import ConversationSerializer,MessageSerializer
from rest_framework.permissions import IsAuthenticated
from api.models import User
from rest_framework.views import APIView
from rest_framework import serializers
from django.utils import timezone

class StartConversationView(generics.CreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]


    def post(self, request, *args, **kwargs):
        user1 = request.user 
        user2_id = request.data.get('user2')  

        try:
            user2 = User.objects.get(id=user2_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        #checks if convo already exists
        conversation = Conversation.objects.filter(user1=user1, user2=user2).first() or \
                       Conversation.objects.filter(user1=user2, user2=user1).first()

        if conversation:
            return Response({
                "message": "Conversation already exists",
                "conversation": ConversationSerializer(conversation).data
            }, status=status.HTTP_200_OK)

        #new convo
        conversation = Conversation.objects.create(user1=user1, user2=user2)
        return Response({
            "message": "Conversation started",
            "conversation": ConversationSerializer(conversation).data
        }, status=status.HTTP_201_CREATED)
#return all users convos
class UserConversationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        conversations = Conversation.objects.filter(user1=user) | Conversation.objects.filter(user2=user)
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)
#new message
class CreateMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        conversation_id = self.request.data.get('conversation')
        if not conversation_id:
            raise serializers.ValidationError({'conversation': 'This field is required.'})

        # Save the new message
        message = serializer.save(sender=self.request.user, conversation_id=conversation_id)

        # Update the latest_message_timestamp for the conversation
        conversation = Conversation.objects.get(id=conversation_id)
        conversation.latest_message_timestamp = timezone.now()
        conversation.save(update_fields=['latest_message_timestamp'])

        return message

class ConversationMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id, *args, **kwargs):
        if not Conversation.objects.filter(id=conversation_id).exists():
            return Response({'error': 'Conversation does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        messages = Message.objects.filter(conversation_id=conversation_id).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)