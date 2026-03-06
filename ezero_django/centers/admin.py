"""Admin registration for centers app."""

from django.contrib import admin
from .models import Center


@admin.register(Center)
class CenterAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'center_type', 'rating', 'verified', 'is_active']
    list_filter = ['city', 'center_type', 'verified', 'is_active']
    search_fields = ['name', 'city', 'address']
    list_editable = ['is_active']
