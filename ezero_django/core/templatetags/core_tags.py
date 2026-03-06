"""
Custom template tags for E-Zero templates.
"""

from django import template

register = template.Library()


@register.filter
def star_range(value):
    """Return a range for star rating display."""
    try:
        return range(int(value))
    except (ValueError, TypeError):
        return range(0)


@register.filter
def empty_star_range(value):
    """Return a range for empty stars."""
    try:
        return range(5 - int(value))
    except (ValueError, TypeError):
        return range(5)


@register.simple_tag
def active_nav(request, url_name):
    """Return 'active' if the current URL matches the given name."""
    from django.urls import reverse
    try:
        if request.path == reverse(url_name):
            return 'active'
    except Exception:
        pass
    return ''


@register.filter
def currency_inr(value):
    """Format a number as Indian Rupee currency."""
    try:
        val = float(value)
        if val == int(val):
            return f"₹{int(val):,}"
        return f"₹{val:,.2f}"
    except (ValueError, TypeError):
        return f"₹{value}"
