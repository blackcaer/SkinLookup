from .models import Item, ItemData
from .serializers import ItemSerializer

def update_item(nameId):
    try:
        item = Item.objects.get(nameId=nameId)
        item_data, created = ItemData.objects.get_or_create(item=item)
        if item_data.is_older_than(hours=24):
            item_data.update_data()
            return {"status": "success", "data": item_data}
        else:
            return {"status": "up_to_date", "message": "Item is up to date"}
    except Item.DoesNotExist:
        return {"status": "error", "message": "Item not found"}

def get_item_data(name=None, name_id=None):
    item = Item.find_item(name=name, name_id=name_id)
    if item is None:
        return None
    item_data, created = ItemData.objects.get_or_create(item=item)
    if item_data.is_older_than(hours=24):
        item_data.update_data()
    return item_data

def filter_items(name=None, item_type=None, item_collection=None):
    items = Item.objects.all()
    if name:
        items = items.filter(name__icontains=name)
    if item_collection:
        items = items.filter(itemCollection__icontains=item_collection)
    if item_type:
        items = items.filter(itemType__icontains=item_type)
    return items