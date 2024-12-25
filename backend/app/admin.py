from django.contrib import admin
from .models import Item, ItemData, PortfolioItem, User

admin.site.register(Item)
admin.site.register(ItemData)
admin.site.register(PortfolioItem)
admin.site.register(User)
