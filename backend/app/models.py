from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError

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
    timeRefreshed = models.DateTimeField(null=True)
    priceWeekAgo = models.FloatField(null=True)
    priceNow = models.FloatField(null=True)
    phsm = models.JSONField(null=True)

    def save(self, *args, **kwargs):
        if not self.priceNow:
            self.priceNow = self.get_current_price()
            self.priceWeekAgo = self.get_week_ago_price()
        super().save(*args, **kwargs)

    def get_current_price(self):
        # Example data fetching logic
        return 3.50 
    
    def get_week_ago_price(self):
        # Example data fetching logic
        return 3.50 

    def is_older_than(self, hours=24):
        if self.timeRefreshed is None:
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

    def update_data(self, new_phsm):
        self.validate_phsm(new_phsm)
        self.phsm = new_phsm
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
