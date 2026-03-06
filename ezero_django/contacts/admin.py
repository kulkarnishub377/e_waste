"""Admin registration for contacts app."""

from django.contrib import admin
from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'city', 'service_type', 'is_handled', 'created_at']
    list_filter = ['is_handled', 'service_type', 'city']
    search_fields = ['name', 'email', 'phone', 'city', 'message']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_handled']
    date_hierarchy = 'created_at'
