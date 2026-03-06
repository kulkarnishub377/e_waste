"""
Core models for the E-Zero site.
Stores services, process steps, advantages, certifications, FAQs,
testimonials, and environmental impact statistics.
"""

from django.db import models


class Service(models.Model):
    """E-waste management services offered by E-Zero."""
    name = models.CharField(max_length=200)
    icon = models.CharField(max_length=100, help_text="Font Awesome class, e.g. 'fas fa-server'")
    description = models.TextField()
    features = models.JSONField(default=list, blank=True, help_text="List of feature strings")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class ProcessStep(models.Model):
    """Steps in the e-waste recycling process."""
    number = models.CharField(max_length=10, help_text="Display number, e.g. '01'")
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Step {self.number}: {self.title}"


class Advantage(models.Model):
    """Reasons to choose E-Zero (Why Us section)."""
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Certification(models.Model):
    """Industry certifications held by E-Zero."""
    name = models.CharField(max_length=200)
    icon = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class FAQ(models.Model):
    """Frequently Asked Questions."""
    question = models.CharField(max_length=500)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question[:80]


class Testimonial(models.Model):
    """Client testimonials."""
    content = models.TextField()
    author_name = models.CharField(max_length=200)
    author_role = models.CharField(max_length=300)
    author_initials = models.CharField(max_length=5)
    rating = models.PositiveIntegerField(default=5)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.author_name} - {self.rating}★"


class AcceptedItemCategory(models.Model):
    """Categories of electronics accepted for recycling."""
    name = models.CharField(max_length=200)
    icon = models.CharField(max_length=100)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Accepted Item Categories'

    def __str__(self):
        return self.name


class ImpactStat(models.Model):
    """Environmental impact statistics."""
    icon = models.CharField(max_length=100)
    target_value = models.PositiveIntegerField()
    unit = models.CharField(max_length=50)
    label = models.CharField(max_length=200)
    equivalent_text = models.CharField(max_length=300)
    equivalent_icon = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.label}: {self.target_value} {self.unit}"


class SiteStat(models.Model):
    """Main statistics displayed on the hero/stats section."""
    icon = models.CharField(max_length=100)
    value = models.CharField(max_length=50, help_text="Display value, e.g. '50,000+'")
    label = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.label}: {self.value}"
