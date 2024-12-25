from django.db import models
from django.contrib.auth.models import AbstractUser

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
    phsm = models.JSONField()

    def __str__(self):
        return f"{self.name} ({self.nameId})"

class ItemData(models.Model):
    item = models.OneToOneField(Item, primary_key=True, on_delete=models.CASCADE)
    timeRefreshed = models.DateTimeField(auto_now=True)
    priceWeekAgo = models.FloatField()
    priceNow = models.FloatField()

    def save(self, *args, **kwargs):
        if not self.priceNow:
            self.priceNow = self.get_current_price()
            self.priceWeekAgo = self.get_current_price()
        super().save(*args, **kwargs)

    def get_current_price(self):
        # Example data fetching logic
        return 3.50 
    
    def get_week_ago_price(self):
        # Example data fetching logic
        return 3.50 

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

