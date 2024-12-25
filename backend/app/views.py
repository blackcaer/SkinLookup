from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Item
from .serializers import ItemBasicSerializer, ItemDataSerializer
from .services import get_item_data, filter_items

@api_view(['GET'])
def get_all_items(request):
    name = request.GET.get('name')
    item_type = request.GET.get('itemType')
    item_collection = request.GET.get('itemCollection')
    items = filter_items(name=name, item_type=item_type, item_collection=item_collection)
    serializer = ItemBasicSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_item_details(request):
    name_id = request.GET.get('nameId')
    name = request.GET.get('name')

    if not name_id and not name:
        return Response({"error": "No identifier provided"}, status=400)
    if not name_id.isdigit():
        return Response({"error": "Nameid has to be number"}, status=400)
    
    item_data = get_item_data(name=name, name_id=name_id)
    if item_data:
        serializer = ItemDataSerializer(item_data)
        return Response(serializer.data)
    else:
        return Response({"error": "Item data not found"}, status=404)

@api_view(['GET'])
def get_matching_results(request, query):
    items = filter_items(name=query)
    return Response(list(items.values('name')))
