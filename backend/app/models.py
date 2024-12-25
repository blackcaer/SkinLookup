from django.db import models
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Item(models.Model):
    appId = models.IntegerField()
    itemType = models.CharField(max_length=100)
    itemCollection = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    nameId = models.IntegerField()
    previewUrl = models.URLField()
    supplyTotalEstimated = models.IntegerField()
    timeAccepted = models.DateField()
    storePrice = models.FloatField()
    phsm = JSONField()

class ItemData(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE)
    timeRefreshed = models.DateTimeField(auto_now=True)
    priceWeekAgo = models.FloatField()
    priceNow = models.FloatField()

class PortfolioItem(models.Model):
    itemData = models.ForeignKey(ItemData, on_delete=models.CASCADE)
    count = models.IntegerField()

class User(AbstractUser):
    portfolio = models.ManyToManyField(PortfolioItem)
