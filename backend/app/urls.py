from django.urls import path
from . import views
from .views import RegisterView, LogoutView

urlpatterns = [
    path('items/all/', views.get_all_items, name='get_all_items'),
    path('items/', views.get_item_details, name='get_item_details'),
    path('portfolio/', views.get_user_portfolio, name='get_user_portfolio'),
    path('portfolio/set_item_count/', views.set_portfolio_item_count, name='set_portfolio_item_count'),
    path('search/<str:query>/', views.get_matching_names, name='get_matching_results'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('is_authenticated/', views.is_authenticated_view, name='is_authenticated'),  # Dodano nową ścieżkę
    path('random_item_name/', views.get_random_item_name, name='get_random_item_name'),
]
