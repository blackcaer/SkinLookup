from django.urls import path
from . import views
from .views import RegisterView, LogoutView

    
urlpatterns = [
    path('items/all/', views.get_all_items, name='get_all_items'),
    path('items/', views.get_item_details, name='get_item_details'),
    path('search/<str:query>/', views.get_matching_results, name='get_matching_results'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
