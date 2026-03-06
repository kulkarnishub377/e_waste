"""
Accounts app models.
Extended user profile for E-Zero users.
"""

from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """Extended profile for E-Zero users with gamification."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, default='')
    wallet_points = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)
    total_recycled = models.PositiveIntegerField(default=0, help_text="Total items recycled")
    co2_saved = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="CO2 saved in kg")
    achievements = models.JSONField(default=list, blank=True)
    preferred_language = models.CharField(max_length=5, default='en')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - Level {self.level}"

    @property
    def display_name(self):
        return self.user.get_full_name() or self.user.username


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    """Auto-create profile when a user is created."""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    """Auto-save profile when user is saved."""
    if hasattr(instance, 'profile'):
        instance.profile.save()
