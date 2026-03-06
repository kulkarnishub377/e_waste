"""
Calculator app models.
Recyclable items and pricing for the e-waste calculator.
"""

from django.db import models


class RecyclableItem(models.Model):
    """An item type that can be recycled with its pricing."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    icon = models.CharField(max_length=100, help_text="Font Awesome class")
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default='unit', help_text="e.g. 'unit', 'kg'")
    category = models.CharField(max_length=100, blank=True, default='General')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - ₹{self.price_per_unit}/{self.unit}"


class ServiceOption(models.Model):
    """Optional paid services that can be added during recycling."""
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - ₹{self.price}"
