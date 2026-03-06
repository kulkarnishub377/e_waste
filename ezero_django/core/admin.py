"""Admin registration for core app models."""

from django.contrib import admin
from .models import (
    Service, ProcessStep, Advantage, Certification,
    FAQ, Testimonial, AcceptedItemCategory, ImpactStat, SiteStat
)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']


@admin.register(ProcessStep)
class ProcessStepAdmin(admin.ModelAdmin):
    list_display = ['number', 'title', 'order']
    list_editable = ['order']


@admin.register(Advantage)
class AdvantageAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon', 'order']
    list_editable = ['order']


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'order']
    list_editable = ['order']


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['author_name', 'author_role', 'rating', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active', 'rating']


@admin.register(AcceptedItemCategory)
class AcceptedItemCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'order']
    list_editable = ['order']


@admin.register(ImpactStat)
class ImpactStatAdmin(admin.ModelAdmin):
    list_display = ['label', 'target_value', 'unit', 'order']
    list_editable = ['order']


@admin.register(SiteStat)
class SiteStatAdmin(admin.ModelAdmin):
    list_display = ['label', 'value', 'icon', 'order']
    list_editable = ['order']
