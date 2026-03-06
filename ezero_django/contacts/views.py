"""
Contacts app views.
"""

from django.views.generic import CreateView
from django.urls import reverse_lazy
from django.contrib import messages
from django.http import JsonResponse
from .models import ContactRequest
from .forms import ContactForm


class ContactFormView(CreateView):
    """Contact form page and submission."""
    model = ContactRequest
    form_class = ContactForm
    template_name = 'contacts/contact.html'
    success_url = reverse_lazy('core:home')

    def form_valid(self, form):
        response = super().form_valid(form)
        if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': True, 'message': 'Thank you! We will contact you within 24 hours.'})
        messages.success(self.request, 'Thank you! Your request has been submitted successfully. We will contact you within 24 hours.')
        return response

    def form_invalid(self, form):
        if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)
        return super().form_invalid(form)
