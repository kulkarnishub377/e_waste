from django.contrib import admin
from .models import Category, Product, Order

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'condition', 'status', 'seller')
    list_filter = ('status', 'condition', 'category')
    search_fields = ('title', 'description', 'seller__username')
    prepopulated_fields = {'slug': ('title',)}
    
    # Custom action to bulk approve listings
    actions = ['approve_listings']
    
    @admin.action(description='Approve selected pending listings')
    def approve_listings(self, request, queryset):
        queryset.update(status='approved')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer', 'product', 'amount_paid', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('buyer__username', 'transaction_id', 'product__title')
