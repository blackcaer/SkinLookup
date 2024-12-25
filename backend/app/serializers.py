from rest_framework import serializers
from .models import Item, PriceHistory

class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    phsm = PriceHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = '__all__'
