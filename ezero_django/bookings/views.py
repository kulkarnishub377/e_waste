"""
Bookings app views.
Handles booking creation and viewing.
"""

import json
from django.views.generic import CreateView, DetailView, ListView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.contrib import messages
from .models import Booking, BookingItem
from .forms import BookingFullForm


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
        return response


class BookingDetailView(DetailView):
    """View booking details / invoice."""
    model = Booking
    template_name = 'bookings/booking_detail.html'
    context_object_name = 'booking'
    slug_field = 'booking_id'
    slug_url_kwarg = 'booking_id'


class BookingListView(ListView):
    """List bookings (for logged-in users)."""
    model = Booking
    template_name = 'bookings/booking_list.html'
    context_object_name = 'bookings'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Booking.objects.filter(user=self.request.user)
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
            pickup_time_slot=data.get('pickup_time_slot', '09:00-11:00'),
            notes=data.get('notes', ''),
            data_destruction=data.get('data_destruction', False),
            compliance_certificate=data.get('compliance_certificate', False),
            user=request.user if request.user.is_authenticated else None,
        )

        # Create booking items
        for item in data.get('items', []):
            BookingItem.objects.create(
                booking=booking,
                item_type=item.get('type', ''),
                brand=item.get('brand', ''),
                condition=item.get('condition', 'working'),
                quantity=item.get('quantity', 1),
                estimated_value=item.get('estimatedValue', 0),
            )

        return JsonResponse({
            'success': True,
            'booking_id': booking.booking_id,
            'message': 'Booking created successfully!'
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
