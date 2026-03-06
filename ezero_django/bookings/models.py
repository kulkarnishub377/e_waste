"""
Bookings app models.
Handles e-waste pickup scheduling and tracking.
"""

from django.db import models
from django.conf import settings


class Booking(models.Model):
    """An e-waste pickup booking."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('scheduled', 'Scheduled'),
        ('assigned', 'Assigned'),
        ('in_transit', 'In Transit'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    TIME_SLOT_CHOICES = [
        ('09:00-11:00', '09:00 AM - 11:00 AM'),
        ('11:00-13:00', '11:00 AM - 01:00 PM'),
        ('14:00-16:00', '02:00 PM - 04:00 PM'),
        ('16:00-18:00', '04:00 PM - 06:00 PM'),
    ]

    # User info (can be nullable for anonymous bookings)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='bookings'
    )
    booking_id = models.CharField(max_length=20, unique=True, editable=False)

    # Personal details (stored on booking for non-logged-in users)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    company = models.CharField(max_length=200, blank=True, default='')

    # Address
    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    # Center
    center = models.ForeignKey(
        'centers.Center', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='bookings'
    )

    # Schedule
    pickup_date = models.DateField()
    pickup_time_slot = models.CharField(max_length=20, choices=TIME_SLOT_CHOICES)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, default='')

    # Services
    data_destruction = models.BooleanField(default=False)
    compliance_certificate = models.BooleanField(default=False)

    # Tracking
    assigned_partner = models.CharField(max_length=200, blank=True, default='')
    weight_kg = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    reward_points = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking {self.booking_id} - {self.name}"

    def save(self, *args, **kwargs):
        if not self.booking_id:
            last = Booking.objects.order_by('-id').first()
            next_id = (last.id + 1) if last else 1
            self.booking_id = f"EZ-{next_id:06d}"
        super().save(*args, **kwargs)

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def total_estimated_value(self):
        return sum(item.estimated_value for item in self.items.all())


class BookingItem(models.Model):
    """An individual item in a booking."""

    CONDITION_CHOICES = [
        ('working', 'Working'),
        ('faulty', 'Faulty / Non-working'),
        ('damaged', 'Damaged'),
        ('unknown', 'Unknown'),
    ]

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='items')
    item_type = models.CharField(max_length=100)
    brand = models.CharField(max_length=100, blank=True, default='')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='working')
    quantity = models.PositiveIntegerField(default=1)
    estimated_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.quantity}x {self.item_type} ({self.condition})"
