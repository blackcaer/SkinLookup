from rest_framework import serializers
from .models import Item, ItemData, PortfolioItem, User
from rest_framework_simplejwt.tokens import RefreshToken
        
class ItemFullSerializer(serializers.ModelSerializer):
    """ Item with phsm """
    class Meta:
        model = Item
        fields = fields = [
            'nameId',
            'appId',
            'itemType',
            'itemCollection',
            'name',
            'previewUrl',
            'supplyTotalEstimated',
            'timeAccepted',
            'storePrice',
            'phsm'
        ]

class ItemBasicSerializer(serializers.ModelSerializer):
    """ Item without phsm """
    class Meta:
        model = Item
        fields = fields = [
            'nameId',
            'appId',
            'itemType',
            'itemCollection',
            'name',
            'previewUrl',
            'supplyTotalEstimated',
            'timeAccepted',
            'storePrice',
        ]

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

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        try:
            RefreshToken(attrs['refresh'])
        except Exception:
            raise serializers.ValidationError("Invalid or expired token.")
        return attrs