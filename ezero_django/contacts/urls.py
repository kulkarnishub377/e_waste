"""Contacts app URL configuration."""

from django.urls import path
from . import views

app_name = 'contacts'

urlpatterns = [
    path('', views.ContactFormView.as_view(), name='contact'),
]
