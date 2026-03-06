"""
Contacts app forms.
"""

from django import forms
from .models import ContactRequest


class ContactForm(forms.ModelForm):
    """Contact / quote request form."""
    class Meta:
        model = ContactRequest
        fields = ['name', 'company', 'email', 'phone', 'city', 'service_type', 'quantity', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Your name', 'required': True}),
            'company': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Company name (optional)'}),
            'email': forms.EmailInput(attrs={'class': 'form-input', 'placeholder': 'your@email.com', 'required': True}),
            'phone': forms.TextInput(attrs={'class': 'form-input', 'placeholder': '+91 98765 43210', 'required': True}),
            'city': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Your city', 'required': True}),
            'service_type': forms.Select(attrs={'class': 'form-input form-select'}),
            'quantity': forms.Select(attrs={'class': 'form-input form-select'}),
            'message': forms.Textarea(attrs={'class': 'form-input form-textarea', 'placeholder': 'Tell us about your requirements...', 'rows': 4}),
        }
