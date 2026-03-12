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


from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from .models import QuizQuestion, QuizAnswer

@login_required
def quiz_view(request):
    """Frontend view to display the quiz questions."""
    # Fetch active questions and prefetch answers for optimization
    questions = QuizQuestion.objects.filter(is_active=True).prefetch_related('answers')
    return render(request, 'blog/quiz.html', {'questions': questions})

@login_required
def submit_quiz(request):
    """AJAX endpoint to grade the quiz and award points."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            answers_data = data.get('answers', {})
            
            total_points_earned = 0
            results = []
            
            for q_id_str, a_id_str in answers_data.items():
                try:
                    question = QuizQuestion.objects.get(id=int(q_id_str))
                    selected_answer = QuizAnswer.objects.get(id=int(a_id_str), question=question)
                    
                    is_correct = selected_answer.is_correct
                    points = question.points_reward if is_correct else 0
                    
                    results.append({
                        'question_id': question.id,
                        'is_correct': is_correct,
                        'points_earned': points,
                        'explanation': question.explanation,
                    })
                    
                    total_points_earned += points
                except (QuizQuestion.DoesNotExist, QuizAnswer.DoesNotExist, ValueError):
                    continue
            
            # Award points to user profile
            if total_points_earned > 0:
                profile = request.user.profile
                profile.wallet_points += total_points_earned
                profile.save()
            
            return JsonResponse({
                'success': True,
                'total_points_earned': total_points_earned,
                'results': results,
                'new_balance': request.user.profile.wallet_points
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
