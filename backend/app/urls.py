from django.urls import path
from . import views
from .views import is_authenticated_view

urlpatterns = [
    path('items/all/', views.get_all_items, name='get_all_items'),
    path('items/', views.get_item_details, name='get_item_details'),
    path('search/<str:query>/', views.get_matching_results, name='get_matching_results'),
    path('is_authenticated/', is_authenticated_view, name='is_authenticated'),
]
