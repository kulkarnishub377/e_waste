"""Calculator app URL configuration."""

from django.urls import path
from . import views

app_name = 'calculator'

urlpatterns = [
    path('', views.CalculatorView.as_view(), name='calculator'),
    path('api/', views.calculator_items_api, name='api'),
]
