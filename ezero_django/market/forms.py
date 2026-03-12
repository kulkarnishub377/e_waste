from django import forms
from .models import Product

class SellDeviceForm(forms.ModelForm):
    """Form for users to list their devices for sale."""
    
    class Meta:
        model = Product
        fields = ['title', 'category', 'description', 'price', 'condition', 'image']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'e.g. iPhone 12 Pro - 256GB - Unlocked'}),
            'category': forms.Select(attrs={'class': 'form-input form-select'}),
            'description': forms.Textarea(attrs={'class': 'form-input form-textarea', 'placeholder': 'Describe battery health, accessories included, scratches, etc.', 'rows': 4}),
            'price': forms.NumberInput(attrs={'class': 'form-input', 'placeholder': 'Selling Price in INR', 'step': '0.01'}),
            'condition': forms.Select(attrs={'class': 'form-input form-select'}),
            # Image widget handled by default Django file input styling later
        }
