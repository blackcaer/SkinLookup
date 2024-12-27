from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError
import requests
# Create your models here.

class Item(models.Model):
    nameId = models.IntegerField(primary_key=True, unique=True)
    appId = models.IntegerField()
    itemType = models.CharField(max_length=100)
    itemCollection = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
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

from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta

class ItemData(models.Model):
    item = models.OneToOneField(Item, primary_key=True, on_delete=models.CASCADE)
    timeRefreshed = models.DateTimeField(null=True,blank=True)
    priceWeekAgo = models.FloatField(null=True,blank=True)
    priceNow = models.FloatField(null=True,blank=True)
    phsm = models.JSONField(null=True,blank=True)

    def save(self, *args, **kwargs):
        if not self.priceNow:
            self.priceNow = self.get_current_price()
            self.priceWeekAgo = self.get_week_ago_price()
        super().save(*args, **kwargs)

    def get_current_price(self):
        return None
    
    def get_week_ago_price(self):
        return None

    def is_older_than(self, hours=24):
        if self.timeRefreshed is None or self.phsm is None:
            return True
        return self.timeRefreshed < timezone.now() - timedelta(hours=hours)

    def validate_phsm(self, phsm):
        if not isinstance(phsm, list):
            raise ValidationError("phsm must be a list")
        
        for entry in phsm:
            if not isinstance(entry, dict):
                raise ValidationError("Each entry in phsm must be a dictionary")
            if not all(key in entry for key in ("date", "median", "volume")):
                raise ValidationError("Each entry in phsm must contain 'date', 'median', and 'volume' keys")
            if not isinstance(entry['date'], str):
                raise ValidationError("Each entry's 'date' must be a string")
            if not isinstance(entry['median'], (int, float)):
                raise ValidationError("Each entry's 'median' must be a number")
            if not isinstance(entry['volume'], int):
                raise ValidationError("Each entry's 'volume' must be an integer")
    
    def _get_phsm_from_api(self,max_days_phsm=7):
        url = f"https://rust.scmm.app/api/item/{self.item.name}/sales?maxDays={max_days_phsm}&ochl=false"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()

    def update_data(self):
        """new_phsm = [{
                "date": "10/10/2024",
                "median": 1.23,
                "volume": 57
            }]"""#self.get_new_phsm()
        #self.validate_phsm(new_phsm)
        #https://rust.scmm.app/api/item/Press%20Vest/sales?maxDays=7&ochl=false
        try:
            self.phsm = self._get_phsm_from_api()
        except requests.HTTPError as e:
            print("Error getting phsm for {self.item.name}: ",e)
            return
        self.timeRefreshed = timezone.now()
        self.priceWeekAgo = self.get_week_ago_price()
        self.priceNow = self.get_current_price()
        self.save()

    def __str__(self):
        return f"{self.item.name} - {self.priceNow}"

class PortfolioItem(models.Model):
    itemData = models.ForeignKey(ItemData, on_delete=models.CASCADE)
    count = models.IntegerField()

    def __str__(self):
        return f"{self.itemData.item.name} - {self.count}"

class User(AbstractUser):
    portfolio = models.ManyToManyField(PortfolioItem, related_name='related_user', blank=True)

    def __str__(self):
        return self.username
