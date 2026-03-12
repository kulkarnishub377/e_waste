"""
Bookings app views.
Handles booking creation and viewing.
"""

import json
import logging
from django.views.generic import CreateView, DetailView, ListView
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.shortcuts import redirect, get_object_or_404
from django.urls import reverse_lazy
from django.contrib import messages
from django.utils import timezone
from .models import Booking, BookingItem, TimeSlot
from .forms import BookingFullForm

# Import newly created advanced Python Services
from services.notifications import NotificationRouter
from services.market_api import MarketPricingEngine
from services.pdf_generator import CertificateGenerator

logger = logging.getLogger(__name__)

class BookingCreateView(CreateView):
    """Create a new booking."""
    model = Booking
    form_class = BookingFullForm
    template_name = 'bookings/booking_create.html'

    def get_success_url(self):
        return reverse_lazy('bookings:detail', kwargs={'booking_id': self.object.booking_id})

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, f'Booking {self.object.booking_id} created successfully!')
        
        # Trigger advanced Notification Service
        NotificationRouter.send_pickup_confirmation(
            user_email=self.object.email,
            booking_ref=self.object.booking_id,
            date=str(self.object.pickup_date)
        )
        if self.object.phone:
            NotificationRouter.dispatch_sms_alert(
                phone_number=self.object.phone,
                message=f"E-Zero Pickup {self.object.booking_id} confirmed for {self.object.pickup_date}."
            )
            
        return response


class BookingDetailView(DetailView):
    """View booking details / invoice."""
    model = Booking
    template_name = 'bookings/booking_detail.html'
    context_object_name = 'booking'
    slug_field = 'booking_id'
    slug_url_kwarg = 'booking_id'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Generate heavy Python Certificate link if applicable
        context['can_download_cert'] = self.object.status == 'COMPLETED' and self.object.compliance_certificate
        return context


class BookingListView(ListView):
    """List bookings (for logged-in users)."""
    model = Booking
    template_name = 'bookings/booking_list.html'
    context_object_name = 'bookings'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Booking.objects.filter(user=self.request.user).order_by('-created_at')
        return Booking.objects.none()


@csrf_exempt
@require_POST
def booking_api(request):
    """JSON API endpoint for creating bookings (used by modal JS)."""
    try:
        data = json.loads(request.body)

        booking = Booking.objects.create(
            name=data.get('name', ''),
            email=data.get('email', ''),
            phone=data.get('phone', ''),
            company=data.get('company', ''),
            address=data.get('address', ''),
            city=data.get('city', ''),
            pincode=data.get('pincode', ''),
            pickup_date=data.get('pickup_date'),
            notes=data.get('notes', ''),
            data_destruction=data.get('data_destruction', False),
            compliance_certificate=data.get('compliance_certificate', False),
            user=request.user if request.user.is_authenticated else None,
        )

        # Handle time slot allocation
        slot_str = data.get('pickup_time_slot')
        if slot_str:
            # Assuming format "09:00-11:00" from JS
            try:
                s_time = slot_str.split('-')[0] + ":00"
                slot_obj = TimeSlot.objects.filter(start_time=s_time).first()
                if not slot_obj:
                    slot_obj = TimeSlot.objects.first()
                booking.pickup_time_slot = slot_obj
            except Exception:
                booking.pickup_time_slot = TimeSlot.objects.first()
        else:
            booking.pickup_time_slot = TimeSlot.objects.first()
        
        booking.save()

        # Initialize Market Pricing Engine
        market_engine = MarketPricingEngine()

        for item in data.get('items', []):
            item_type = item.get('type', 'general')
            qty = item.get('quantity', 1)
            
            # Use Python algorithm to determine true live market value
            market_data = market_engine.calculate_device_yield(device_type=item_type, weight_kg=2.5) # Avg 2.5kg
            true_value = market_data.get('total_estimated_value_usd', 0) * 83.0 # Convert USD to INR
            
            BookingItem.objects.create(
                booking=booking,
                item_type=item_type,
                brand=item.get('brand', ''),
                condition=item.get('condition', 'working'),
                quantity=qty,
                estimated_value=round(true_value * qty, 2)
            )

        # Dispatch API Alerts
        NotificationRouter.send_pickup_confirmation(booking.email, booking.booking_id, booking.pickup_date)

        return JsonResponse({
            'success': True,
            'booking_id': booking.booking_id,
            'message': 'Booking processed via Market Engine successfully!'
        })
    except Exception as e:
        logger.error(f"API Booking failed: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

def download_certificate(request, booking_id):
    """
    Python endpoint that generates a formal NIST compliance PDF on the fly.
    """
    booking = get_object_or_404(Booking, booking_id=booking_id)
    
    if booking.status != 'COMPLETED' or not booking.compliance_certificate:
        messages.error(request, "Certificate is not yet available for this booking.")
        return redirect('bookings:detail', booking_id=booking.booking_id)
        
    # Heavy Python PDF Generation
    pdf_buffer = CertificateGenerator.generate_nist_800_88_certificate(booking, request.user)
    
    response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="EZero-Certificate-{booking.booking_id}.pdf"'
    return response
