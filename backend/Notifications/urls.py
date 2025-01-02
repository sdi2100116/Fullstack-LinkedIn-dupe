
from django.contrib import admin
from django.urls import path
from Notifications import views

urlpatterns = [
    path('connectionnotifications/', views.ConnectionNotificationListView.as_view()),
    path('connectionnotificationsacc/<int:notification_id>/', views.UpdateConnectionNotificationView.as_view()),
    path('getnotnumber/',views.get_notifications_number),
    path('postnotifications/', views.PostNotificationListView.as_view(), name='post-notification-list'),
    path('postnotificationsdel/<int:notification_id>/', views.DeletePostNotificationView.as_view()),
]
