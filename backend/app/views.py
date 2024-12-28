from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Item, User
from .serializers import ItemSerializer, ItemDataSerializer, LogoutSerializer, RegisterSerializer
from .services import get_item_data, filter_items
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

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
    return Response(serializer.data)

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
        return Response(serializer.data)
    else:
        return Response({"error": "Item not found"}, status=404)

@api_view(['GET'])
def get_matching_names(request, query):
    items = filter_items(name=query)
    names = [item['name'] for item in items.values('name')[:10]]
    return Response(names)

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
