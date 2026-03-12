from django.urls import path
from . import views

app_name = 'market'

urlpatterns = [
    path('', views.ProductListView.as_view(), name='storefront'),
    path('sell/', views.SellDeviceView.as_view(), name='sell_device'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('<slug:slug>/checkout/', views.checkout_view, name='checkout'),
    path('payment/<int:order_id>/success/', views.dummy_payment_success, name='dummy_payment_success'),
]
