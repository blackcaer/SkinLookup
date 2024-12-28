import logging
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Item, User, ItemData, PortfolioItem
from .serializers import ItemSerializer, ItemDataSerializer, LogoutSerializer, PortfolioItemSerializer, RegisterSerializer
from .services import get_item_data, filter_items
from rest_framework import generics

logger = logging.getLogger('django')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_authenticated_view(request):
    return Response({"detail": "User is authenticated"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_items(request):
    name = request.GET.get('name')
    item_type = request.GET.get('itemType')
    item_collection = request.GET.get('itemCollection')
    items = filter_items(name=name, item_type=item_type, item_collection=item_collection)
    serializer = ItemSerializer(items, many=True)

    portfolio_items = []

    logger.debug("Is user authenticated: ",request.user.is_authenticated)

    if request.user.is_authenticated:
        portfolio_items = (
            request.user.portfolio.all()
            .values_list('item_data__item__name', flat=True)
        )

    response_data = {
        "items": serializer.data,
        "names_in_portfolio": list(portfolio_items),
    }

    return Response(response_data)

@api_view(['GET'])
def get_item_details(request):
    name_id = request.GET.get('nameId')
    name = request.GET.get('name')

    if not name_id and not name:
        return Response({"error": "No identifier provided"}, status=400)
    elif name_id and not name_id.isdigit():
        return Response({"error": "Nameid has to be number"}, status=400)
    
    item_data = get_item_data(name=name, name_id=name_id)
    if item_data:
        serializer = ItemDataSerializer(item_data)

        is_in_portfolio = False
        if request.user.is_authenticated:
            is_in_portfolio = request.user.portfolio.filter(item_data=item_data).exists()

        response_data = {
            "item": serializer.data,
            "is_in_portfolio": is_in_portfolio,
        }

        return Response(response_data)
    else:
        return Response({"error": "Item not found"}, status=404)

@api_view(['GET'])
def get_matching_names(request, query):
    items = filter_items(name=query)
    names = [item['name'] for item in items.values('name')[:10]]
    return Response(names)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_portfolio(request):
    portfolio = request.user.portfolio.all()
    serialized_portfolio = PortfolioItemSerializer(portfolio, many=True)
    return Response(serialized_portfolio.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_portfolio_item_count(request):
    name = request.data.get('name')
    count = request.data.get('count')

    if not name or count is None:
        return Response({"error": "Name and count are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        count = int(count)
    except ValueError:
        return Response({"error": "Count must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

    if count < 0:
        count = 0
        
    try:
        item = Item.objects.get(name=name)
    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

    item_data, created = ItemData.objects.get_or_create(item=item)

    item_data.force_update_data()

    if count == 0:
        PortfolioItem.objects.filter(user=request.user, item_data=item_data).delete()
        return Response({"message": "Portfolio item deleted"}, status=status.HTTP_204_NO_CONTENT)
    else:
        portfolio_item, created = PortfolioItem.objects.update_or_create(
            user=request.user,
            item_data=item_data,
            defaults={'count': count}
        )
        return Response({"message": "Portfolio item updated"}, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LogoutView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LogoutSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            refresh_token = RefreshToken(serializer.validated_data['refresh'])
            refresh_token.blacklist()
        except Exception:
            return Response({"detail": "Failed to blacklist token."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Logout successful."}, status=status.HTTP_204_NO_CONTENT)
