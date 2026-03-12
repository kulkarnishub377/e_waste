"""
Core app views.
Home page that renders all sections of the landing page.
"""

from django.views.generic import TemplateView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

from .models import (
    Service, ProcessStep, Advantage, Certification,
    FAQ, Testimonial, AcceptedItemCategory, ImpactStat, SiteStat
)
from blog.models import Article
from calculator.models import RecyclableItem, ServiceOption
from services.chatbot import AutomatedTaskBot

@csrf_exempt
@require_POST
def chatbot_api(request):
    """API endpoint for the AI Chatbot Widget."""
    try:
        data = json.loads(request.body)
        message = data.get('message', '')
        if not message:
            return JsonResponse({'error': 'Message cannot be empty.'}, status=400)
            
        # Optional: Send the request.user if they are logged in so bot can handle contextual queries
        user = request.user if request.user.is_authenticated else None
        
        reply = AutomatedTaskBot.process_message(user, message)
        
        return JsonResponse({'reply': reply})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


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
