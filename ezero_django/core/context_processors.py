"""
Context processor to inject site-wide settings into all templates.
"""

from django.conf import settings


def site_settings(request):
    """Inject E-Zero site configuration into every template context."""
    return {
        'SITE_NAME': getattr(settings, 'EZERO_SITE_NAME', 'E-Zero'),
        'SITE_TAGLINE': getattr(settings, 'EZERO_SITE_TAGLINE', ''),
        'SITE_PHONE': getattr(settings, 'EZERO_PHONE', ''),
        'SITE_EMAIL': getattr(settings, 'EZERO_EMAIL', ''),
        'SITE_ADDRESS': getattr(settings, 'EZERO_ADDRESS', ''),
    }
