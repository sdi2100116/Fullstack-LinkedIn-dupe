from django.urls import path
from chat import views

urlpatterns = [
    path('conversationsstart/', views.StartConversationView.as_view()),
    path('conversations/', views.UserConversationsView.as_view()),
    path('messages/', views.CreateMessageView.as_view()),
    path('conversations/<int:conversation_id>/', views.ConversationMessagesView.as_view())
]