"""Admin registration for accounts app."""

from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'wallet_points', 'level', 'total_recycled', 'co2_saved']
    list_filter = ['level']
    search_fields = ['user__username', 'user__email', 'phone']
    readonly_fields = ['created_at']
