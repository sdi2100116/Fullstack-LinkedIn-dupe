from django.urls import path, include

from blogs import views


urlpatterns = [
    path('', views.PostView.as_view(), name='api-root'),
    path('fetch/', views.PostViewF.as_view()),
    path('comments/<int:post_id>/', views.CommentView.as_view()),
    path('interest/<int:post_id>/', views.InterestView.as_view()),
    path('view/<int:post_id>/', views.RecordView.as_view()),
    path('delete/<int:post_id>/', views.delete_post)
]

