from django.urls import path
from . import views

urlpatterns = [
    path('items/', views.get_all_items, name='get_all_items'),
    path('items/<str:identifier>/', views.get_item_details, name='get_item_details_by_name'),
    path('items/<int:identifier>/', views.get_item_details, name='get_item_details_by_id'),
    path('search/<str:query>/', views.get_matching_results, name='get_matching_results'),
    path('items/update/<int:item_id>/', views.update_item, name='update_item'),
]
