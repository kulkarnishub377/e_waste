"""
Centers app views.
Listing, detail, and JSON API for center locations.
"""

from django.views.generic import ListView, DetailView
from django.http import JsonResponse
from .models import Center


class CenterListView(ListView):
    """Display all centers with map."""
    model = Center
    template_name = 'centers/center_list.html'
    context_object_name = 'centers'
    queryset = Center.objects.filter(is_active=True)


class CenterDetailView(DetailView):
    """Display a single center's details."""
    model = Center
    template_name = 'centers/center_detail.html'
    context_object_name = 'center'


def centers_api(request):
    """JSON API endpoint for centers (used by the map JS)."""
    lat_str = request.GET.get('lat')
    lng_str = request.GET.get('lng')

    if lat_str and lng_str:
        try:
            lat = float(lat_str)
            lng = float(lng_str)
            centers_obj = Center.get_nearest_centers(lat, lng)
            centers = []
            for c in centers_obj:
                c_dict = {
                    'id': c.id, 'name': c.name, 'city': c.city, 'latitude': c.latitude, 
                    'longitude': c.longitude, 'address': c.address, 'accepts': c.accepts, 
                    'verified': c.verified, 'rating': c.rating, 'contact': c.contact, 
                    'hours': c.hours, 'services': c.services, 'reviews_count': c.reviews_count, 
                    'center_type': c.center_type, 'computed_distance_km': round(getattr(c, '_computed_distance', 0), 2)
                }
                centers.append(c_dict)
        except ValueError:
            # Fallback if invalid float
            centers = Center.objects.filter(is_active=True).values(
                'id', 'name', 'city', 'latitude', 'longitude', 'address',
                'accepts', 'verified', 'rating', 'contact', 'hours',
                'services', 'reviews_count', 'center_type'
            )
    else:
        centers = Center.objects.filter(is_active=True).values(
            'id', 'name', 'city', 'latitude', 'longitude', 'address',
            'accepts', 'verified', 'rating', 'contact', 'hours',
            'services', 'reviews_count', 'center_type'
        )
    data = []
    for c in centers:
        data.append({
            'id': c['id'],
            'name': c['name'],
            'city': c['city'],
            'lat': float(c['latitude']),
            'lng': float(c['longitude']),
            'address': c['address'],
            'accepts': c['accepts'],
            'verified': c['verified'],
            'rating': float(c['rating']),
            'contact': c['contact'],
            'hours': c['hours'],
            'services': c['services'],
            'reviews': c['reviews_count'],
            'type': c['center_type'],
            'distance_km': c.get('computed_distance_km')
        })
    return JsonResponse({'centers': data})
