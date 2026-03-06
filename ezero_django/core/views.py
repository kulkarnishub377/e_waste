"""
Core app views.
Home page that renders all sections of the landing page.
"""

from django.views.generic import TemplateView
from .models import (
    Service, ProcessStep, Advantage, Certification,
    FAQ, Testimonial, AcceptedItemCategory, ImpactStat, SiteStat
)
from blog.models import Article
from calculator.models import RecyclableItem, ServiceOption


class HomePageView(TemplateView):
    """Main landing page with all sections."""
    template_name = 'core/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['services'] = Service.objects.filter(is_active=True)
        context['process_steps'] = ProcessStep.objects.all()
        context['advantages'] = Advantage.objects.all()
        context['certifications'] = Certification.objects.all()
        context['faqs'] = FAQ.objects.filter(is_active=True)
        context['testimonials'] = Testimonial.objects.filter(is_active=True)
        context['accepted_items'] = AcceptedItemCategory.objects.all()
        context['impact_stats'] = ImpactStat.objects.all()
        context['site_stats'] = SiteStat.objects.all()
        context['articles'] = Article.objects.filter(is_published=True)[:6]
        context['calc_items'] = RecyclableItem.objects.filter(is_active=True)
        context['service_options'] = ServiceOption.objects.filter(is_active=True)
        return context


class AboutPageView(TemplateView):
    """About page."""
    template_name = 'core/about.html'
