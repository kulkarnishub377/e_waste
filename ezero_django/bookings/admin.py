"""Admin registration for bookings app."""

from django.contrib import admin
from .models import Booking, BookingItem


class BookingItemInline(admin.TabularInline):
    model = BookingItem
    extra = 0
    fields = ['item_type', 'brand', 'condition', 'quantity', 'estimated_value']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_id', 'name', 'city', 'pickup_date', 'pickup_time_slot', 'status', 'created_at']
    list_filter = ['status', 'city', 'pickup_date', 'data_destruction']
    search_fields = ['booking_id', 'name', 'email', 'phone', 'city']
    readonly_fields = ['booking_id', 'created_at', 'updated_at']
    inlines = [BookingItemInline]
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Booking Info', {'fields': ('booking_id', 'status', 'user')}),
        ('Customer', {'fields': ('name', 'email', 'phone', 'company')}),
        ('Address', {'fields': ('address', 'city', 'pincode')}),
        ('Schedule', {'fields': ('pickup_date', 'pickup_time_slot', 'notes')}),
        ('Services', {'fields': ('data_destruction', 'compliance_certificate')}),
        ('Tracking', {'fields': ('assigned_partner', 'weight_kg', 'reward_points', 'center')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
