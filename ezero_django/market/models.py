"""
Market app models.
Handles the buying and selling of used electronics.
"""

from django.db import models
from django.conf import settings


class Category(models.Model):
    """Device categories for the marketplace."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, default='')

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    """A used device listed for sale."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved & Listed'),
        ('rejected', 'Rejected'),
        ('sold', 'Sold Out'),
    ]
    
    CONDITION_CHOICES = [
        ('like_new', 'Like New'),
        ('good', 'Good Condition'),
        ('fair', 'Fair (Some scuffs)'),
        ('refurbished', 'Certified Refurbished'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    
    # Seller info (null means E-Zero owns this inventory)
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='listed_products'
    )
    
    image = models.ImageField(upload_to='market/products/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Shipping info
    free_shipping = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class Order(models.Model):
    """A purchase order in the marketplace."""
    
    STATUS_CHOICES = [
        ('processing', 'Processing Payment'),
        ('paid', 'Paid & Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled')
    ]
    
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='market_orders')
    product = models.OneToOneField(Product, on_delete=models.PROTECT, related_name='order')
    
    # Shipping Address
    full_name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    
    # Payment Tracking
    transaction_id = models.CharField(max_length=100, blank=True, default='')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.product.title}"
