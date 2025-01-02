from django.urls import path
from Jobs import views

urlpatterns = [
    path('', views.JobListCreateView.as_view()),  
    path('<int:job_id>/apply/', views.CreateApplicationView.as_view()),
    path('<int:job_id>/applicants/', views.JobApplicantsView.as_view()),
    path('<int:job_id>/delete/', views.delete_job),
]