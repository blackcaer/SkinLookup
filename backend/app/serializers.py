from rest_framework import serializers
from .models import Item, ItemData, PortfolioItem, User

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ItemDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemData
        fields = '__all__'

class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    portfolio = PortfolioItemSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = '__all__'
