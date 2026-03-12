"""Core app URL configuration."""

from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.HomePageView.as_view(), name='home'),
    path('api/chat/', views.chatbot_api, name='chatbot_api'),
    path('about/', views.AboutPageView.as_view(), name='about'),
]
