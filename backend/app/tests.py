from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient
from datetime import timedelta
from .models import Item, ItemData, PortfolioItem, User
from .services import update_item, get_item_data, filter_items

class ItemModelTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.item1 = Item.objects.create(
            nameId=1, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Some item", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        self.item2 = Item.objects.create(
            nameId=2, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Some item 2", previewUrl="https://example.com/2",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
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
                name="Duplicate item", previewUrl="https://example.com/3",
                supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
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

    def test_get_item_details_invalid_nameid(self):
        response = self.client.get(reverse('get_item_details'), {'nameId': 'invalid'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Nameid has to be number")

class ItemDataModelTest(TestCase):

    def setUp(self):
        self.item = Item.objects.create(
            nameId=176460408, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        self.item_data = ItemData.objects.create(
            item=self.item, price_week_ago=2.50, price_newest=2.75,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}],
            timeRefreshed=timezone.now()
        )

    def test_item_data_creation(self):
        self.assertEqual(ItemData.objects.count(), 1)

    def test_item_data_existence(self):
        self.assertTrue(ItemData.objects.filter(item=self.item).exists())

    def test_item_data_deletion(self):
        self.item_data.delete()
        self.assertFalse(ItemData.objects.filter(item=self.item).exists())

    def test_is_older_than(self):
        self.item_data.timeRefreshed = timezone.now() - timedelta(hours=25)
        self.item_data.save()
        self.assertTrue(self.item_data.is_older_than(hours=24))

        self.item_data.timeRefreshed = timezone.now() - timedelta(hours=23)
        self.item_data.save()
        self.assertFalse(self.item_data.is_older_than(hours=24))

        self.item_data.timeRefreshed = None
        self.item_data.save()
        self.assertTrue(self.item_data.is_older_than(hours=24))
        self.assertTrue(self.item_data.is_older_than(hours=0))

class PortfolioItemModelTest(TestCase):

    def setUp(self):
        self.item = Item.objects.create(
            nameId=176460408, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        self.item_data = ItemData.objects.create(
            item=self.item, price_week_ago=2.50, price_newest=2.75,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}],
            timeRefreshed=timezone.now()
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
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.item = Item.objects.create(
            nameId=176460408, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        self.item_data = ItemData.objects.create(
            item=self.item, price_week_ago=2.50, price_newest=2.75,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}],
            timeRefreshed=timezone.now()
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

    def test_user_login(self):
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        # Check if the user is authenticated
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.data['access'])
        auth_response = self.client.get(reverse('is_authenticated'))
        self.assertEqual(auth_response.status_code, status.HTTP_200_OK)
        self.assertTrue(auth_response.data['detail'] == "User is authenticated")

    def test_user_login_invalid_credentials(self):
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_user_register(self):
        response = self.client.post(reverse('register'), {'username': 'newuser', 'password': 'newpassword'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_user_logout(self):
        login_response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        refresh_token = login_response.data['refresh']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + login_response.data['access'])
        logout_response = self.client.post(reverse('logout'), {'refresh': refresh_token})
        self.assertEqual(logout_response.status_code, status.HTTP_204_NO_CONTENT)

        # Ensure the token is blacklisted and cannot be used again
        response = self.client.post(reverse('token_refresh'), {'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

        # Check if the user is logged out
        self.client.credentials()
        auth_response = self.client.get(reverse('is_authenticated'))
        self.assertEqual(auth_response.status_code, status.HTTP_401_UNAUTHORIZED)

class ServicesTest(TestCase):

    def setUp(self):
        self.item = Item.objects.create(
            nameId=176460408, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        self.item_data = ItemData.objects.create(
            item=self.item, price_week_ago=2.50, price_newest=2.75,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}],
            timeRefreshed=timezone.now() - timedelta(days=2)
        )

    def test_get_item_data(self):
        item_data = get_item_data(name_id=176460408)
        self.assertIsNotNone(item_data)
        self.assertEqual(item_data.item.name, 'Forest Raiders Locker')

    def test_filter_items(self):
        items = filter_items(name='Forest Raiders')
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].name, 'Forest Raiders Locker')
