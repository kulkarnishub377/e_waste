"""Admin registration for calculator app."""

from django.contrib import admin
from .models import RecyclableItem, ServiceOption


@admin.register(RecyclableItem)
class RecyclableItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'price_per_unit', 'unit', 'category', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    list_editable = ['order', 'is_active', 'price_per_unit']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ServiceOption)
class ServiceOptionAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'order', 'is_active']
    list_editable = ['order', 'is_active', 'price']
