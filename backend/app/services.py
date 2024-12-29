from .models import Item, ItemData
import re


def get_item_data(name=None, name_id=None):
    item = Item.find_item(name=name, name_id=name_id)
    if item is None:
        return None
    item_data, created = ItemData.objects.get_or_create(item=item)
    status = item_data.update_item()["status"]
    if status == 500:
        raise RuntimeError("Error while updating item data")
    elif status == 204:
        item_data.refresh_from_db()

    return item_data


def filter_items(name=None, item_type=None, item_collection=None):
    items = Item.objects.all()
    if name:
        items = items.filter(name__iregex=r'\b' + re.escape(name))
    if item_collection:
        items = items.filter(itemCollection__iregex=r'\b' +
                             re.escape(item_collection))
    if item_type:
        items = items.filter(itemType__iregex=r'\b' + re.escape(item_type))
    return items
