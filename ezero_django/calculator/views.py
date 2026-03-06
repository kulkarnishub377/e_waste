"""
Calculator app views.
"""

from django.views.generic import TemplateView
from django.http import JsonResponse
from .models import RecyclableItem, ServiceOption


class CalculatorView(TemplateView):
    """Pricing calculator page."""
    template_name = 'calculator/calculator.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['items'] = RecyclableItem.objects.filter(is_active=True)
        context['service_options'] = ServiceOption.objects.filter(is_active=True)
        return context


def calculator_items_api(request):
    """JSON API for calculator items."""
    items = list(RecyclableItem.objects.filter(is_active=True).values(
        'id', 'name', 'slug', 'icon', 'price_per_unit', 'unit', 'category'
    ))
    for item in items:
        item['price_per_unit'] = float(item['price_per_unit'])
    services = list(ServiceOption.objects.filter(is_active=True).values(
        'id', 'name', 'description', 'price'
    ))
    for svc in services:
        svc['price'] = float(svc['price'])
    return JsonResponse({'items': items, 'services': services})
