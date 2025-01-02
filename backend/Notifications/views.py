from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from .models import ConnectionNotification,PostNotification
from .serializer import ConnectionNotificationSerializer,PostNotificationSerializer
from rest_framework.decorators import api_view

class ConnectionNotificationListView(generics.ListCreateAPIView):
    serializer_class = ConnectionNotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ConnectionNotification.objects.filter(connection__to_user=user)


class UpdateConnectionNotificationView(APIView):
    def patch(self, request, notification_id):
        try:
           
            notification = ConnectionNotification.objects.get(id=notification_id)
        except ConnectionNotification.DoesNotExist:
            return Response({'detail': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)

        
        if notification.connection.to_user != request.user:
            return Response({'detail': 'You are not authorized to update this notification.'}, status=status.HTTP_403_FORBIDDEN)

        
        serializer = ConnectionNotificationSerializer(notification, data=request.data, partial=True)
        if serializer.is_valid():
            updated_notification = serializer.save()
            
            
            connection = updated_notification.connection
            connection.status = 'accepted' if updated_notification.answer else 'rejected'
            connection.save()

            
            notification.delete()
            
            return Response({'detail': 'Notification updated and deleted.'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_notifications_number(request):
    user = request.user
    
        
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    
    number_of_cnotifications= ConnectionNotification.objects.filter(connection__to_user=user).count()
    number_of_pnotifications= PostNotification.objects.filter(user=user).count()
    number_of_notifications=number_of_cnotifications+number_of_pnotifications

    return Response({'number_of_notifications': number_of_notifications}, status=status.HTTP_200_OK)




class PostNotificationListView(generics.ListCreateAPIView):
    serializer_class = PostNotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return PostNotification.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DeletePostNotificationView(APIView):
    def delete(self, request, notification_id):
        try:
            notification = PostNotification.objects.get(id=notification_id)
        except PostNotification.DoesNotExist:
            return Response({'detail': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)

        if notification.user != request.user:
            return Response({'detail': 'You are not authorized to delete this notification.'}, status=status.HTTP_403_FORBIDDEN)

        notification.delete()
        return Response({'detail': 'Notification deleted.'}, status=status.HTTP_204_NO_CONTENT)