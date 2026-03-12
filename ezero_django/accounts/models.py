"""
Accounts app models.
Extended user profile for E-Zero users.
"""

from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


class Badge(models.Model):
    """Gamification badges awarded for ESG milestones."""
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=100, help_text="Font Awesome class or image URL")
    required_co2_saved = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    required_toxic_diverted = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    """Extended profile for E-Zero users with gamification."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, default='')
    wallet_points = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)
    total_recycled = models.PositiveIntegerField(default=0, help_text="Total items recycled")
    co2_saved = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="CO2 saved in kg")
    toxic_diverted_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Toxic materials diverted in kg")
    earned_badges = models.ManyToManyField(Badge, blank=True, related_name='earned_by')
    
    preferred_language = models.CharField(max_length=5, default='en')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - Level {self.level}"

    @property
    def display_name(self):
        return self.user.get_full_name() or self.user.username
        
    def check_and_award_badges(self):
        """Evaluate if user qualifies for new badges based on ESG metrics."""
        new_badges = Badge.objects.filter(
            required_co2_saved__lte=self.co2_saved,
            required_toxic_diverted__lte=self.toxic_diverted_kg
        ).exclude(id__in=self.earned_badges.all())
        
        for badge in new_badges:
            self.earned_badges.add(badge)
            # You could trigger a notification here
            
        return len(new_badges) > 0


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
