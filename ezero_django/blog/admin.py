"""Admin registration for blog app."""

from django.contrib import admin
from .models import Article, QuizQuestion, QuizAnswer


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'published_date', 'is_published']
    list_filter = ['category', 'is_published', 'published_date']
    search_fields = ['title', 'content', 'summary']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_published']
    date_hierarchy = 'published_date'


class QuizAnswerInline(admin.TabularInline):
    model = QuizAnswer
    extra = 3


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'difficulty', 'points_reward', 'is_active']
    list_filter = ['difficulty', 'is_active']
    search_fields = ['text']
    inlines = [QuizAnswerInline]
