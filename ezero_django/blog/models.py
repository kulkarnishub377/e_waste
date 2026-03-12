"""
Blog app models.
Articles and resources about e-waste management.
"""

from django.db import models
from django.utils.text import slugify


class Article(models.Model):
    """A blog article or resource."""

    CATEGORY_CHOICES = [
        ('regulations', 'Regulations'),
        ('security', 'Security'),
        ('sustainability', 'Sustainability'),
        ('safety', 'Safety'),
        ('guides', 'Guides'),
        ('health', 'Health'),
        ('news', 'News'),
    ]

    title = models.CharField(max_length=500)
    slug = models.SlugField(max_length=500, unique=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    image_url = models.URLField(max_length=500, blank=True, default='')
    summary = models.TextField(help_text="Short summary for card display")
    content = models.TextField(help_text="Full article content (HTML)")
    read_time = models.CharField(max_length=20, default='5 min read')
    published_date = models.DateField()
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class QuizQuestion(models.Model):
    """An educational question for the Eco-Warrior quiz."""
    
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    text = models.CharField(max_length=500, help_text="The question text.")
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='easy')
    points_reward = models.PositiveIntegerField(default=10, help_text="Wallet points awarded for a correct answer.")
    explanation = models.TextField(help_text="Explanation shown after answering.", blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.text


class QuizAnswer(models.Model):
    """Possible answers for a QuizQuestion."""
    
    question = models.ForeignKey(QuizQuestion, related_name='answers', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.question.text[:20]}... - {self.text}"
