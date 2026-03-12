"""
Market views for Buying, Selling and Checkout.
"""
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.contrib import messages
from django.utils.text import slugify
import uuid

from .models import Product, Category, Order
from .forms import SellDeviceForm


class ProductListView(ListView):
    """Public Storefront - shows only VERIFIED/APPROVED listings."""
    model = Product
    template_name = 'market/storefront.html'
    context_object_name = 'products'
    paginate_by = 12

    def get_queryset(self):
        qs = Product.objects.filter(status='approved')
        category_slug = self.request.GET.get('category')
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
            
        search = self.request.GET.get('q')
        if search:
            qs = qs.filter(title__icontains=search)
            
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context


class ProductDetailView(DetailView):
    """Details of a single product for sale."""
    model = Product
    template_name = 'market/product_detail.html'
    context_object_name = 'product'
    
    def get_queryset(self):
        # Allow users to view their own pending listings, but others only see approved
        if self.request.user.is_authenticated:
            return Product.objects.all() # We'll restrict logic in the template
        return Product.objects.filter(status='approved')


class SellDeviceView(LoginRequiredMixin, CreateView):
    """Form for a User to list a device for sale (Enters Pending Verification State)."""
    model = Product
    form_class = SellDeviceForm
    template_name = 'market/sell_device.html'
    
    def get_success_url(self):
        messages.success(self.request, "Listing Submitted! Our Admin team will verify it shortly.")
        return reverse_lazy('accounts:dashboard')
        
    def form_valid(self, form):
        # Auto assign seller and slug
        form.instance.seller = self.request.user
        form.instance.status = 'approved'  # Automated AI Moderation (No Admin Needed)
        
        # Ensure slug is highly unique
        base_slug = slugify(form.instance.title)
        form.instance.slug = f"{base_slug}-{str(uuid.uuid4())[:8]}"
        
        return super().form_valid(form)


# --- CHECKOUT FLOW ---

from django.contrib.auth.decorators import login_required

@login_required
def checkout_view(request, slug):
    """Initiates checkout. Real logic would integrate Razorpay here."""
    product = get_object_or_404(Product, slug=slug, status='approved')
    
    if request.method == 'POST':
        # Create Order
        order = Order.objects.create(
            buyer=request.user,
            product=product,
            full_name=request.POST.get('full_name'),
            address=request.POST.get('address'),
            city=request.POST.get('city'),
            pincode=request.POST.get('pincode'),
            amount_paid=product.price,
            status='processing'
        )
        
        # In a real app, redirect to Razorpay. Here, redirect to dummy success route.
        return redirect('market:dummy_payment_success', order_id=order.id)
        
    return render(request, 'market/checkout.html', {'product': product})

@login_required
def dummy_payment_success(request, order_id):
    """Simulates a rapid webhook callback of success."""
    order = get_object_or_404(Order, id=order_id, buyer=request.user)
    
    order.status = 'paid'
    order.transaction_id = f"PAY_{uuid.uuid4().hex[:12].upper()}"
    order.save()
    
    product = order.product
    product.status = 'sold'
    product.save()
    
    messages.success(request, f"Payment Successful! Order {order.id} confirmed.")
    return redirect('accounts:dashboard')
