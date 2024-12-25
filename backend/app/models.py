from django.db import models
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
    phsm = models.JSONField()

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
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
