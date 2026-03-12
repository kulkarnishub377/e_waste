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
from centers.models import Center

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

@csrf_exempt
@require_POST
def dummy_payment_webhook(request, booking_id):
    """
    Simulates a payment or payout webhook callback from Razorpay/Stripe.
    In real life this checks a signature, but here it just forces success.
    """
    booking = get_object_or_404(Booking, booking_id=booking_id)
    
    # Simulate processing logic
    if booking.payment_amount > 0:
        booking.payment_status = 'paid'
    else:
        booking.payment_status = 'payout_completed'
        
    import uuid
    booking.transaction_id = f"SIM_{uuid.uuid4().hex[:10].upper()}"
    booking.save()
    
    return JsonResponse({
        'status': 'success',
        'message': f'Dummy transaction {booking.transaction_id} processed successfully',
        'new_state': booking.payment_status
    })

@csrf_exempt
@require_POST
def iot_bin_webhook(request):
    """
    Simulated IoT Webhook for Smart Bins.
    A physical bin pings this endpoint when it's full (e.g., fill_level > 80%).
    """
    try:
        # Require a simple API token in headers
        token = request.headers.get('Authorization')
        if token != "Bearer EZERO_IOT_SECRET_TOKEN":
            return JsonResponse({'error': 'Unauthorized IoT Device'}, status=401)
            
        data = json.loads(request.body)
        bin_id = data.get('bin_id')
        fill_level = data.get('fill_level', 0)
        lat = data.get('lat')
        lng = data.get('lng')
        
        if not bin_id or float(fill_level) < 80.0:
            return JsonResponse({'status': 'ignored', 'message': 'Bin not full enough for dispatch.'})
            
        # Find the nearest center to dispatch from
        nearest_centers = Center.get_nearest_centers(float(lat), float(lng), limit=1)
        dispatch_center = nearest_centers[0] if nearest_centers else Center.objects.first()
        
        # Auto-create the booking
        booking = Booking.objects.create(
            name=f"Automated IoT Dispatch: {bin_id}",
            email="iot_system@ezero.in",
            phone="0000000000",
            address=f"Smart Bin Location Auto-Ping ({lat}, {lng})",
            city=dispatch_center.city if dispatch_center else "System",
            pincode="000000",
            pickup_date=timezone.now().date() + timezone.timedelta(days=1),
            pickup_time_slot=TimeSlot.objects.first(),
            notes=f"Auto-generated because {bin_id} reached {fill_level}% capacity.",
            center=dispatch_center,
            status='assigned'
        )
        
        # Trigger Alerts
        NotificationRouter.dispatch_sms_alert(
            phone_number="+91-9999999999", # Fleet Manager
            message=f"URGENT: Smart Bin {bin_id} is {fill_level}% full. Truck dispatched. Ref: {booking.booking_id}"
        )
        
        return JsonResponse({
            'status': 'dispatch_triggered',
            'booking_id': booking.booking_id,
            'message': f'Pickup truck scheduled from {dispatch_center.name}'
        })
        
    except Exception as e:
        logger.error(f"IoT Webhook failed: {str(e)}")
        return JsonResponse({'error': 'Webhook processing failed', 'details': str(e)}, status=400)


def booking_tracking_view(request, booking_id):
    """
    Publicly accessible live tracking page for a booking.
    Does not require login so users can share the link or scan the QR.
    """
    booking = get_object_or_404(Booking, booking_id=booking_id)
    
    # Map status to a progress integer for the UI template
    status_map = {
        'pending': 1,
        'scheduled': 2,
        'assigned': 3,
        'in_transit': 4,
        'completed': 5,
        'cancelled': -1
    }
    
    context = {
        'booking': booking,
        'progress_step': status_map.get(booking.status, 1)
    }
    
    return render(request, 'bookings/live_tracking.html', context)
