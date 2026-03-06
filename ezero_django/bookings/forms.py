"""
Bookings app forms.
"""

from django import forms
from .models import Booking, BookingItem


class BookingStep1Form(forms.ModelForm):
    """Step 1: Customer information."""
    class Meta:
        model = Booking
        fields = ['name', 'phone', 'email', 'company', 'address', 'city', 'pincode']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter your full name'}),
            'phone': forms.TextInput(attrs={'class': 'form-input', 'placeholder': '+91 98765 43210'}),
            'email': forms.EmailInput(attrs={'class': 'form-input', 'placeholder': 'your@email.com'}),
            'company': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Company name (optional)'}),
            'address': forms.Textarea(attrs={'class': 'form-input form-textarea', 'placeholder': 'Enter complete pickup address with landmark', 'rows': 3}),
            'city': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'City'}),
            'pincode': forms.TextInput(attrs={'class': 'form-input', 'placeholder': '411001'}),
        }


class BookingStep3Form(forms.ModelForm):
    """Step 3: Schedule date/time and services."""
    class Meta:
        model = Booking
        fields = ['pickup_date', 'pickup_time_slot', 'notes', 'data_destruction', 'compliance_certificate']
        widgets = {
            'pickup_date': forms.DateInput(attrs={'class': 'form-input', 'type': 'date'}),
            'pickup_time_slot': forms.Select(attrs={'class': 'form-input form-select'}),
            'notes': forms.Textarea(attrs={'class': 'form-input form-textarea', 'placeholder': 'Any special instructions...', 'rows': 3}),
        }


class BookingItemForm(forms.ModelForm):
    """Form for individual booking items."""
    class Meta:
        model = BookingItem
        fields = ['item_type', 'brand', 'condition', 'quantity', 'estimated_value']
        widgets = {
            'item_type': forms.TextInput(attrs={'class': 'form-input'}),
            'brand': forms.TextInput(attrs={'class': 'form-input'}),
            'condition': forms.Select(attrs={'class': 'form-input form-select'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-input', 'min': 1}),
            'estimated_value': forms.NumberInput(attrs={'class': 'form-input', 'step': '0.01'}),
        }
