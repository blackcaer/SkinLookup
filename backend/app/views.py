from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Item, ItemData
from .serializers import ItemSerializer, ItemDataSerializer
from .services import update_item

@api_view(['GET'])
def get_all_items(request):
    items = Item.objects.all()
    name = request.GET.get('name')
    item_type = request.GET.get('itemType')
    item_collection = request.GET.get('itemCollection')
    if name:
        items = items.filter(name__icontains=name)
    if item_type:
        items = items.filter(itemType__icontains=item_type)
    if item_collection:
        items = items.filter(itemCollection__icontains=item_collection)

    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_item_details(request, phsm=False):
    name_id = request.GET.get('nameId')
    name = request.GET.get('name')
    try:
        if name_id:
            item = Item.objects.get(nameId=name_id)
        elif name:
            item = Item.objects.get(name=name)
        else:
            return Response({"error": "No identifier provided"}, status=400)
        serializer = ItemSerializer(item)
        return Response(serializer.data)
    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

@api_view(['GET'])
def get_matching_results(request, query):
    items = Item.objects.filter(name__icontains=query).values('name')
    return Response(list(items))
