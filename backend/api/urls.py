from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path,include

from api import views



urlpatterns = [
    path('', views.getRoutes),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('users/', views.AllUsersView.as_view(), name='user-list'),
    path('profile/<str:username>/', views.get_profile_by_username),
    path('changepass/',views.ChangePasswordView.as_view()),
    path('changeemail/',views.ChangeEmailView.as_view()),
    path('connectionsWuser/', views.connections_api_view),
    path('connectionsstatus/<str:username>/', views.connection_status_api_view),
    path('sendrequest/<str:username>/', views.send_request),
    path('connectionsnumber/',views.get_connections_number),
    path('rec/<int:user_id>/', views.top_posts_for_user),
    path('profile/<str:username>/bio/', views.profile_bio_view),
    path('delete-profile/', views.delete_profile),
    path('user_for_admin/<int:user_id>/', views.get_user_for_admin),

]