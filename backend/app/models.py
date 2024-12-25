from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Item(models.Model):
    nameId = models.IntegerField(primary_key=True,unique=True)
    appId = models.IntegerField()
    itemType = models.CharField(max_length=100)
    itemCollection = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    previewUrl = models.URLField()
    supplyTotalEstimated = models.IntegerField()
    timeAccepted = models.DateField()
    storePrice = models.FloatField()
    phsm = models.JSONField()

class ItemData(models.Model):
    item = models.OneToOneField(Item,primary_key=True, on_delete=models.CASCADE)
    timeRefreshed = models.DateTimeField(auto_now=True)
    priceWeekAgo = models.FloatField()
    priceNow = models.FloatField()

class PortfolioItem(models.Model):
    itemData = models.ForeignKey(ItemData, on_delete=models.CASCADE)
    count = models.IntegerField()

class User(AbstractUser):
    portfolio = models.ManyToManyField(PortfolioItem, related_name='related_user', blank=True)

