from django.urls import path, include

from PersonalData import views

urlpatterns = [
    path('skills/', views.SkillsView.as_view()),
    path('education/', views.EducationView.as_view()),
    path('experience/', views.ExperienceView.as_view())
]