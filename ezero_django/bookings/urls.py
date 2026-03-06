"""Bookings app URL configuration."""

from django.urls import path
from . import views

app_name = 'bookings'

urlpatterns = [
    path('', views.BookingListView.as_view(), name='list'),
    path('create/', views.BookingCreateView.as_view(), name='create'),
    path('api/', views.booking_api, name='api'),
    path('<str:booking_id>/', views.BookingDetailView.as_view(), name='detail'),
]
