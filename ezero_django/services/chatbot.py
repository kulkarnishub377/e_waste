import re
import logging
from bookings.models import Booking

logger = logging.getLogger(__name__)

class AutomatedTaskBot:
    """
    NLP Bot responsible for automatically managing tasks, tracking bookings, 
    and guiding users so no human admin intervention is required.
    """
    
    @staticmethod
    def process_message(user, message):
        msg = message.lower()
        
        # 1. Booking Tracking Task
        if 'track' in msg or 'status' in msg or 'where' in msg:
            match = re.search(r'bk-\w+', msg, re.IGNORECASE)
            if match:
                booking_id = match.group().upper()
                try:
                    booking = Booking.objects.get(booking_id=booking_id)
                    return f"Task found! Booking <strong>{booking_id}</strong> is currently <strong>{booking.get_status_display()}</strong>. <br><a href='/bookings/{booking_id}/track/' class='text-cyan-400 underline'>Click here for Live Logistics Tracking</a>."
                except Booking.DoesNotExist:
                    return f"I couldn't locate a task with the ID {booking_id}. Please check the ID."
            return "I can track your tasks automatically! Please provide your Booking ID (e.g., BK-1102A)."
            
        # 2. Marketplace & Auto-Verification
        elif 'sell' in msg or 'market' in msg or 'list' in msg:
            return "Great news! Our AI Auto-Moderation instantly verifies device listings, so <strong>no admin waiting period is needed</strong>! <br><a href='/market/sell/' class='text-green-400 underline'>List your device instantly</a>."
            
        # 3. Scheduling a Task / Pickup
        elif 'pickup' in msg or 'book' in msg or 'schedule' in msg:
            return "I can help you schedule an automated pickup. <br><a href='/bookings/create/' class='text-yellow-400 underline'>Open the Booking Portal</a>."
            
        # 4. Pricing / Calculator
        elif 'price' in msg or 'quote' in msg or 'value' in msg or 'calculator' in msg:
            return "I can supply an automated real-time quote for your items. <br><a href='/calculator/' class='text-accent underline'>Use the AI Pricing Calculator</a>."
            
        # 5. Fallback Default
        else:
            return (
                "Hello! I am the <strong>E-Zero Auto-Bot</strong>. I manage all tasks autonomously without human admins. "
                "You can ask me to:<br>"
                "• 'Track BK-xxx'<br>"
                "• 'Schedule a pickup'<br>"
                "• 'Sell a device'"
            )
