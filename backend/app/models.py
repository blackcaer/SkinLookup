from datetime import timedelta
import time
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import datetime, timedelta
import requests

MAX_DAYS_PHSM = -1  # Max days of price history to fetched from api. -1 means all data
ITEMDATA_EXPIRATION_HOURS =  24


class Item(models.Model):
    nameId = models.IntegerField(primary_key=True, unique=True)
    appId = models.IntegerField()
    itemType = models.CharField(max_length=100)
    itemCollection = models.CharField(max_length=100)
    name = models.CharField(max_length=100, unique=True)
    previewUrl = models.URLField()
    supplyTotalEstimated = models.IntegerField()
    timeAccepted = models.DateField()
    storePrice = models.FloatField()

    def __str__(self):
        return f"{self.name} ({self.nameId})"

    @classmethod
    def find_item(cls, name=None, name_id=None):
        try:
            if name_id:
                return cls.objects.get(nameId=name_id)
            elif name:
                return cls.objects.get(name=name)
            return None
        except cls.DoesNotExist:
            return None


class ItemData(models.Model):
    item = models.OneToOneField(
        Item, primary_key=True, on_delete=models.CASCADE, unique=True)
    time_refreshed = models.DateTimeField(null=True, blank=True)
    price_week_ago = models.FloatField(null=True, blank=True)
    price_newest = models.FloatField(null=True, blank=True)
    phsm = models.JSONField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self._update_price_data_from_phsm()
        super().save(*args, **kwargs)

    def _update_price_data_from_phsm(self):
        if not self.phsm or self.phsm == []:
            self.price_week_ago = None
            self.price_newest = None
            return

        latest_entry = self.phsm[-1]  # Newest price from api response
        latest_date = datetime.fromisoformat(latest_entry["date"])
        self.price_newest = latest_entry["median"]

        seven_days_ago = latest_date - timedelta(days=7)
        seven_days_ago_entry = None

        # Searching for first record with date <= seven_days_ago
        for entry in reversed(self.phsm):
            entry_date = datetime.fromisoformat(entry["date"])
            if entry_date <= seven_days_ago:
                seven_days_ago_entry = entry
                break

        # If not enough data, set price_week_ago to newest price
        if seven_days_ago_entry:
            self.price_week_ago = seven_days_ago_entry["median"]
        else:
            self.price_week_ago = self.price_newest

    def _get_phsm_from_api(self, max_days_phsm):
        url = f"https://rust.scmm.app/api/item/{self.item.name}/sales?maxDays={max_days_phsm}&ochl=false"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            filtered_data = [
                {"date": entry["date"], "median": entry["median"],
                    "volume": entry["volume"]}
                for entry in data
            ]
            return filtered_data
        else:
            response.raise_for_status()

    def is_older_than(self, hours=24):
        if self.time_refreshed is None or self.phsm is None:
            return True
        return self.time_refreshed < timezone.now() - timedelta(hours=hours)

    def force_update_data(self):
        print(f"Updating {self.item.name} data")
        start_time = time.time()
        try:
            self.phsm = self._get_phsm_from_api(max_days_phsm=MAX_DAYS_PHSM)
        except requests.HTTPError as e:
            print(f"Error getting phsm for {self.item.name}: ", e)
            return
        finally:
            print(f"Updating {self.item.name} data took {time.time() - start_time :.2f} seconds")
        self.time_refreshed = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.item.name} - {self.price_newest}"

    def update_item(self):
        try:
            if self.is_older_than(hours=ITEMDATA_EXPIRATION_HOURS):
                
                self.force_update_data()   
                 
                return {"status": 204, "message": "Item has been updated"}
            else:
                return {"status": 304, "message": "Item is up to date"}
        except requests.HTTPError:
            return {"status": 500, "message": "HTTPError while updating item data"}


class PortfolioItem(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE,
                             related_name='portfolio', null=False, blank=False)
    item_data = models.ForeignKey(ItemData, on_delete=models.CASCADE)
    count = models.IntegerField()

    class Meta:
        unique_together = [['user', 'item_data']]

    def __str__(self):
        return f"{self.item_data.item.name} - {self.count}"


class User(AbstractUser):

    def __str__(self):
        return self.username
