"""
Accounts app views.
Registration, login, profile, and dashboard.
"""

from django.views.generic import CreateView, UpdateView, TemplateView
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.contrib import messages
from .forms import RegistrationForm, LoginForm, ProfileForm
from .models import UserProfile
from bookings.models import Booking
from market.models import Order, Product


class RegisterView(CreateView):
    """User registration."""
    form_class = RegistrationForm
    template_name = 'accounts/register.html'
    success_url = reverse_lazy('accounts:login')

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Account created successfully! Please log in.')
        return response


class CustomLoginView(LoginView):
    """Custom login page."""
    form_class = LoginForm
    template_name = 'accounts/login.html'
    redirect_authenticated_user = True


class CustomLogoutView(LogoutView):
    """Logout view."""
    next_page = reverse_lazy('core:home')


class DashboardView(LoginRequiredMixin, TemplateView):
    """User dashboard showing bookings, stats, and achievements."""
    template_name = 'accounts/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Pickups / E-Waste
        context['bookings'] = Booking.objects.filter(user=self.request.user).order_by('-created_at')[:5]
        context['total_bookings'] = Booking.objects.filter(user=self.request.user).count()
        context['profile'] = self.request.user.profile if hasattr(self.request.user, 'profile') else None
        
        # Market Integration
        context['market_purchases'] = Order.objects.filter(buyer=self.request.user).order_by('-created_at')[:5]
        context['market_listings'] = Product.objects.filter(seller=self.request.user).order_by('-created_at')[:5]
        
        # ESG Math Conversions (approx 21kg CO2 = 1 tree)
        if context['profile']:
            co2 = float(context['profile'].co2_saved)
            context['trees_equivalent'] = int(co2 / 21)
            
        return context


class ProfileView(LoginRequiredMixin, UpdateView):
    """Edit user profile."""
    model = UserProfile
    form_class = ProfileForm
    template_name = 'accounts/profile.html'
    success_url = reverse_lazy('accounts:dashboard')

    def get_object(self, queryset=None):
        return self.request.user.profile

    def get_initial(self):
        initial = super().get_initial()
        initial['first_name'] = self.request.user.first_name
        initial['last_name'] = self.request.user.last_name
        initial['email'] = self.request.user.email
        return initial

    def form_valid(self, form):
        # Also update User model fields
        user = self.request.user
        user.first_name = form.cleaned_data['first_name']
        user.last_name = form.cleaned_data['last_name']
        user.email = form.cleaned_data['email']
        user.save()
        messages.success(self.request, 'Profile updated successfully!')
        return super().form_valid(form)
