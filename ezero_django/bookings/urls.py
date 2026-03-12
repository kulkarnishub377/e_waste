"""Bookings app URL configuration."""

from django.urls import path
from . import views

app_name = 'bookings'

urlpatterns = [
    path('', views.BookingListView.as_view(), name='list'),
    path('create/', views.BookingCreateView.as_view(), name='create'),
    path('api/create/', views.booking_api, name='api_create'),
    path('api/iot-webhook/', views.iot_bin_webhook, name='iot_webhook'),
    path('<str:booking_id>/', views.BookingDetailView.as_view(), name='detail'),
    path('<str:booking_id>/track/', views.booking_tracking_view, name='live_tracking'),
    path('<str:booking_id>/download-certificate/', views.download_certificate, name='download_certificate'),
    path('<str:booking_id>/payment/simulate/', views.dummy_payment_webhook, name='dummy_payment'),
]
