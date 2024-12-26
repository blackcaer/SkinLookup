from datetime import timedelta
from django.utils import timezone
from .models import Item, ItemData
from .serializers import ItemSerializer

def update_item(item_id, data):
    try:
        item = Item.objects.get(id=item_id)
        item_data, created = ItemData.objects.get_or_create(item=item)
        if item_data.is_older_than(hours=24):
            serializer = ItemSerializer(item, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                update_item_data(item)
                return {"status": "success", "data": serializer.data}
            return {"status": "error", "errors": serializer.errors}
        else:
            return {"status": "up_to_date", "message": "Item is up to date"}
    except Item.DoesNotExist:
        return {"status": "error", "message": "Item not found"}

def update_item_data(item):
    # Example data fetching logic
    new_price_now = 3.50  # Replace with actual data fetching logic
    item_data, created = ItemData.objects.get_or_create(item=item)
    item_data.priceWeekAgo = item_data.priceNow
    item_data.priceNow = new_price_now
    item_data.save()

def _find_item(name=None, name_id=None):
    try:
        if name_id:
            item = Item.objects.get(nameId=name_id)
        elif name:
            item = Item.objects.get(name=name)
        else:
            return None
        return item
    except Item.DoesNotExist:
        return None

def get_item_data(name=None, name_id=None):
    try:
        item = _find_item(name=name, name_id=name_id)
        if item is None:
            return None
        item_data, created = ItemData.objects.get_or_create(item=item)
        if item_data.is_older_than(hours=24):
            update_item_data(item)
        return item_data
    except ItemData.DoesNotExist:
        return None

def filter_items(name=None, item_type=None, item_collection=None):
    items = Item.objects.all()
    if name:
        items = items.filter(name__icontains=name)
    if item_collection:
        items = items.filter(itemCollection__icontains=item_collection)
    if item_type:
        items = items.filter(itemType__icontains=item_type)
    return items