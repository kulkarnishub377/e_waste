"""
Blog app views.
Article listing and detail views.
"""

from django.views.generic import ListView, DetailView
from .models import Article


class ArticleListView(ListView):
    """Display all published articles."""
    model = Article
    template_name = 'blog/article_list.html'
    context_object_name = 'articles'
    queryset = Article.objects.filter(is_published=True)
    paginate_by = 9


class ArticleDetailView(DetailView):
    """Display a single article."""
    model = Article
    template_name = 'blog/article_detail.html'
    context_object_name = 'article'
    slug_url_kwarg = 'slug'
