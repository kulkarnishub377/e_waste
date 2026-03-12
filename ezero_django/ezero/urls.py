"""
E-Zero URL Configuration.
Main URL router that includes all app URLs.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Customize admin site
admin.site.site_header = 'E-Zero Administration'
admin.site.site_title = 'E-Zero Admin'
admin.site.index_title = 'E-Waste Management Dashboard'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('centers/', include('centers.urls')),
    path('bookings/', include('bookings.urls')),
    path('blog/', include('blog.urls')),
    path('contact/', include('contacts.urls')),
    path('calculator/', include('calculator.urls')),
    path('accounts/', include('accounts.urls')),
    path('market/', include('market.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
