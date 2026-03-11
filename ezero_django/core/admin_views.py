from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from django.db.models.functions import TruncMonth
from django.db.models import Sum

from bookings.models import Booking
from services.analytics import EnvironmentalImpactAnalyzer
from services.ml_predictor import ESGVolumeForecaster

class CustomAdminSite(admin.AdminSite):
    site_header = "E-Zero Core Oversight"
    site_title = "E-Zero Admin Portal"
    index_title = "Global Systems Administration"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('ai-dashboard/', self.admin_view(self.ai_dashboard_view), name='ai-dashboard'),
        ]
        return custom_urls + urls

    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        # Inject the custom dashboard link at the top
        app_list.insert(0, {
            'name': 'Proprietary AI Systems',
            'app_label': 'ai_systems',
            'app_url': '',
            'has_module_perms': True,
            'models': [
                {
                    'name': 'Executive ML Predictor Dashboard',
                    'object_name': 'ai_dashboard',
                    'admin_url': '/admin/ai-dashboard/',
                    'view_only': True,
                }
            ]
        })
        return app_list

    def ai_dashboard_view(self, request):
        # 1. Fetch raw querysets for Analytics Engine
        qs = Booking.objects.all()
        
        # 2. Run heavy pure Python analytics 
        analyzer = EnvironmentalImpactAnalyzer()
        annual_report = analyzer.generate_annual_esg_report(qs)
        
        # 3. Compile Historical Time-Series Matrix for ML Engine
        # We simulate the volumes by counting bookings per month. In reality, we'd sum weights.
        monthly_volumes = {}
        for b in qs:
            month = b.created_at.strftime("%Y-%m")
            # Assume ~10.5kg per random booking chunk if approximate_weight isn't tracked properly
            w = float(getattr(b, 'approximate_weight', 10.5))
            monthly_volumes[month] = monthly_volumes.get(month, 0.0) + w

        # 4. Fire the Pure Python AI Predictor
        forecaster = ESGVolumeForecaster()
        forecast_report = forecaster.generate_forecast_report(monthly_volumes, months_to_predict=6)

        context = dict(
            self.each_context(request),
            title="Executive ML / ESG Predictor Dashboard",
            esg_report=annual_report,
            ml_forecast=forecast_report,
            error=forecast_report.get('error')
        )
        return TemplateResponse(request, "admin/ai_dashboard.html", context)

# Initialize the custom admin and override the default
custom_admin_site = CustomAdminSite(name='custom_admin')
