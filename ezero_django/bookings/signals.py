import logging
from decimal import Decimal
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Booking
from accounts.models import UserProfile

logger = logging.getLogger(__name__)

# Constants for ESG calculation
CO2_SAVED_PER_KG = Decimal('1.5')
TOXIC_DIVERTED_PER_KG = Decimal('0.3')

@receiver(post_save, sender=Booking)
def update_user_esg_metrics(sender, instance, created, **kwargs):
    """
    When a booking is marked COMPLETED, calculate the ESG metrics based on weight
    and update the user's profile gamification stats.
    """
    if not instance.user:
        return
        
    # We only process if it is newly marked as COMPLETED and has weight
    if instance.status == 'completed' and instance.weight_kg:
        try:
            profile = instance.user.profile
            # Calculate metrics
            co2_contrib = instance.weight_kg * CO2_SAVED_PER_KG
            toxic_contrib = instance.weight_kg * TOXIC_DIVERTED_PER_KG
            
            # Add to user totals
            profile.co2_saved += co2_contrib
            profile.toxic_diverted_kg += toxic_contrib
            profile.total_recycled += instance.items.count()
            
            # Check for level ups and badges
            new_badges_earned = profile.check_and_award_badges()
            
            # Simple levelling algorithm (1 level per 50kg CO2 saved)
            new_level = 1 + int(profile.co2_saved // Decimal('50'))
            if new_level > profile.level:
                profile.level = new_level
                
            profile.save()
            logger.info(f"Updated ESG metrics for {instance.user}. Earned Badges: {new_badges_earned}")
            
        except Exception as e:
            logger.error(f"Error updating ESG metrics for booking {instance.booking_id}: {e}")
