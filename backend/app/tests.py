from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Item, ItemData, PortfolioItem, User

class ItemModelTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.item1 = Item.objects.create(
            nameId=1, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}]
        )
        self.item2 = Item.objects.create(
            nameId=2, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker 2", previewUrl="https://example.com/2",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}]
        )

    def test_item_creation(self):
        self.assertEqual(Item.objects.count(), 2)

    def test_item_existence(self):
        self.assertTrue(Item.objects.filter(nameId=1).exists())
        self.assertTrue(Item.objects.filter(nameId=2).exists())

    def test_item_deletion(self):
        self.item1.delete()
        self.assertFalse(Item.objects.filter(nameId=1).exists())
        self.assertEqual(Item.objects.count(), 1)

    def test_primary_key_unique(self):
        with self.assertRaises(Exception):
            Item.objects.create(
                nameId=1, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
                name="Duplicate Locker", previewUrl="https://example.com/3",
                supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49,
                phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}]
            )

    def test_get_all_items(self):
        response = self.client.get(reverse('get_all_items'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_item_details(self):
        response = self.client.get(reverse('get_item_details'), {'nameId': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_item_details_not_found(self):
        response = self.client.get(reverse('get_item_details'), {'nameId': 999})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_item_details_no_identifier(self):
        response = self.client.get(reverse('get_item_details'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class ItemDataModelTest(TestCase):

    def setUp(self):
        self.item = Item.objects.create(
            nameId=1, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}]
        )
        self.item_data = ItemData.objects.create(
            item=self.item, priceWeekAgo=2.50, priceNow=2.75
        )

    def test_item_data_creation(self):
        self.assertEqual(ItemData.objects.count(), 1)

    def test_item_data_existence(self):
        self.assertTrue(ItemData.objects.filter(item=self.item).exists())

    def test_item_data_deletion(self):
        self.item_data.delete()
        self.assertFalse(ItemData.objects.filter(item=self.item).exists())

class PortfolioItemModelTest(TestCase):

    def setUp(self):
        self.item = Item.objects.create(
            nameId=1, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}]
        )
        self.item_data = ItemData.objects.create(
            item=self.item, priceWeekAgo=2.50, priceNow=2.75
        )
        self.portfolio_item = PortfolioItem.objects.create(
            itemData=self.item_data, count=5
        )

    def test_portfolio_item_creation(self):
        self.assertEqual(PortfolioItem.objects.count(), 1)

    def test_portfolio_item_existence(self):
        self.assertTrue(PortfolioItem.objects.filter(itemData=self.item_data).exists())

    def test_portfolio_item_deletion(self):
        self.portfolio_item.delete()
        self.assertFalse(PortfolioItem.objects.filter(itemData=self.item_data).exists())

class UserModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.item = Item.objects.create(
            nameId=1, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}]
        )
        self.item_data = ItemData.objects.create(
            item=self.item, priceWeekAgo=2.50, priceNow=2.75
        )
        self.portfolio_item = PortfolioItem.objects.create(
            itemData=self.item_data, count=5
        )
        self.user.portfolio.add(self.portfolio_item)

    def test_user_creation(self):
        self.assertEqual(User.objects.count(), 1)

    def test_user_portfolio(self):
        self.assertEqual(self.user.portfolio.count(), 1)

    def test_user_portfolio_item_existence(self):
        self.assertTrue(self.user.portfolio.filter(itemData=self.item_data).exists())

    def test_user_deletion(self):
        self.user.delete()
        self.assertFalse(User.objects.filter(username='testuser').exists())
