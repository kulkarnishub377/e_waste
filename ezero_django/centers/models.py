"""
Centers app models.
Stores recycling center / collection point locations.
"""

import math
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

    def distance_to(self, target_lat: float, target_lon: float) -> float:
        """
        Calculates the Haversine distance in kilometers between this Center 
        and the target coordinates without requiring PostGIS.
        """
        # Convert degrees to radians
        lat1, lon1 = math.radians(float(self.latitude)), math.radians(float(self.longitude))
        lat2, lon2 = math.radians(float(target_lat)), math.radians(float(target_lon))

        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        r = 6371 # Radius of earth in kilometers
        return r * c

    @classmethod
    def get_nearest_centers(cls, lat: float, lon: float, limit: int = 5):
        """
        Returns the closest centers sorted by distance.
        Note: Since SQLite does not have native Geospatial functions, 
        this computes distances in memory.
        """
        centers = list(cls.objects.filter(is_active=True))
        
        # Decorate with distance
        for center in centers:
            center._computed_distance = center.distance_to(lat, lon)
            
        # Sort by the dynamic attribute
        centers.sort(key=lambda c: c._computed_distance)
        
        return centers[:limit]
