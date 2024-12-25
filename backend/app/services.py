from datetime import datetime, timedelta
from .models import Item, ItemData
from .serializers import ItemSerializer

def update_item(item_id, data):
    try:
        item = Item.objects.get(id=item_id)
        item_data, created = ItemData.objects.get_or_create(item=item)
        if item_data.timeRefreshed < datetime.now() - timedelta(days=1):
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
        item_data, created = ItemData.objects.get_or_create(item=item)
        if item_data.timeRefreshed < datetime.now() - timedelta(days=1):
            update_item_data(item)
        return item_data
    except Item.DoesNotExist:
        return None