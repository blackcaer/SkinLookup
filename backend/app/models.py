from django.db import models

# Create your models here.

class PriceHistory(models.Model):
    date = models.DateField()
    median = models.FloatField()
    volume = models.IntegerField()

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
    phsm = models.ManyToManyField(PriceHistory)
