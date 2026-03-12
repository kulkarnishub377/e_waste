"""Blog app URL configuration."""

from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('', views.ArticleListView.as_view(), name='list'),
    path('eco-quiz/', views.quiz_view, name='quiz'),
    path('eco-quiz/submit/', views.submit_quiz, name='submit_quiz'),
    path('<slug:slug>/', views.ArticleDetailView.as_view(), name='detail'),
]
