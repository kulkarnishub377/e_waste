"""Centers app URL configuration."""

from django.urls import path
from . import views

app_name = 'centers'

urlpatterns = [
    path('', views.CenterListView.as_view(), name='list'),
    path('api/', views.centers_api, name='api'),
    path('<int:pk>/', views.CenterDetailView.as_view(), name='detail'),
]
