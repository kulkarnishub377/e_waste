"""
Contacts app models.
Stores contact form submissions and quote requests.
"""

from django.db import models


class ContactRequest(models.Model):
    """A contact form or quote request submission."""

    SERVICE_CHOICES = [
        ('corporate', 'Corporate IT Asset Disposal'),
        ('data', 'Data Destruction Service'),
        ('residential', 'Residential Pickup'),
        ('battery', 'Battery Recycling'),
        ('other', 'Other / Multiple Services'),
    ]

    QUANTITY_CHOICES = [
        ('1-10', '1-10 items'),
        ('10-50', '10-50 items'),
        ('50-200', '50-200 items'),
        ('200+', '200+ items'),
        ('bulk', 'Bulk / Ongoing requirement'),
    ]

    name = models.CharField(max_length=200)
    company = models.CharField(max_length=200, blank=True, default='')
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    service_type = models.CharField(max_length=50, choices=SERVICE_CHOICES, blank=True, default='')
    quantity = models.CharField(max_length=20, choices=QUANTITY_CHOICES, blank=True, default='')
    message = models.TextField(blank=True, default='')
    is_handled = models.BooleanField(default=False)
    handled_by = models.CharField(max_length=200, blank=True, default='')
    admin_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Request'
        verbose_name_plural = 'Contact Requests'

    def __str__(self):
        return f"{self.name} - {self.service_type or 'General'} ({self.created_at.strftime('%Y-%m-%d')})"
