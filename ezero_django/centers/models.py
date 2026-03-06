"""
Centers app models.
Stores recycling center / collection point locations.
"""

from django.db import models


class Center(models.Model):
    """A recycling center or collection point."""

    CENTER_TYPE_CHOICES = [
        ('E-Zero', 'E-Zero (Owned)'),
        ('Partner', 'Partner Center'),
    ]

    name = models.CharField(max_length=300)
    city = models.CharField(max_length=100, db_index=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    address = models.TextField()
    accepts = models.JSONField(default=list, help_text="List of accepted item types")
    verified = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    contact = models.CharField(max_length=50, blank=True, default='')
    hours = models.CharField(max_length=100, default='9:00 AM - 6:00 PM')
    services = models.JSONField(default=list, help_text="List of services offered")
    reviews_count = models.PositiveIntegerField(default=0)
    center_type = models.CharField(max_length=20, choices=CENTER_TYPE_CHOICES, default='E-Zero')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['city', 'name']

    def __str__(self):
        return f"{self.name} ({self.city})"
