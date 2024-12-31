from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient
from datetime import timedelta
from .models import Item, ItemData, PortfolioItem, User
from .services import get_item_data, filter_items


class ItemModelTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.item1 = Item.objects.create(
            nameId=1, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Some item", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        phsm_data = [
            {"date": "2024-10-03", "median": 2.50, "volume": 50},
            {"date": "2024-10-10", "median": 2.75, "volume": 57}
        ]
        self.item1data = ItemData.objects.create(
            item=self.item1, phsm=phsm_data, time_refreshed=timezone.now()
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
        response = self.client.get(
            reverse('get_item_details'), {'nameId': 999})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_item_details_no_identifier(self):
        response = self.client.get(reverse('get_item_details'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_item_details_invalid_nameid(self):
        response = self.client.get(
            reverse('get_item_details'), {'nameId': 'invalid'})
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
            time_refreshed=timezone.now()  # Updated field name
        )

    def test_item_data_creation(self):
        self.assertEqual(ItemData.objects.count(), 1)

    def test_item_data_existence(self):
        self.assertTrue(ItemData.objects.filter(item=self.item).exists())

    def test_item_data_deletion(self):
        self.item_data.delete()
        self.assertFalse(ItemData.objects.filter(item=self.item).exists())

    def test_is_older_than(self):
        self.item_data.time_refreshed = timezone.now(
        ) - timedelta(hours=25)  # Updated field name
        self.item_data.save()
        self.assertTrue(self.item_data.is_older_than(hours=24))

        self.item_data.time_refreshed = timezone.now(
        ) - timedelta(hours=23)  # Updated field name
        self.item_data.save()
        self.assertFalse(self.item_data.is_older_than(hours=24))

        self.item_data.time_refreshed = None  # Updated field name
        self.item_data.save()
        self.assertTrue(self.item_data.is_older_than(hours=24))
        self.assertTrue(self.item_data.is_older_than(hours=0))

    def test_price_fields_update_on_creation(self):
        item = Item.objects.create(
            nameId=176460409, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker 2", previewUrl="https://example.com/2",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        phsm_data = [
            {"date": "2024-10-03", "median": 2.50, "volume": 50},
            {"date": "2024-10-10", "median": 2.75, "volume": 57}
        ]
        item_data = ItemData.objects.create(
            item=item, phsm=phsm_data, time_refreshed=timezone.now()
        )
        self.assertEqual(item_data.price_newest, 2.75)
        self.assertEqual(item_data.price_week_ago, 2.50)

    def test_price_fields_update_with_insufficient_data(self):
        item = Item.objects.create(
            nameId=176460410, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker 3", previewUrl="https://example.com/3",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        phsm_data = [
            {"date": "2024-10-10", "median": 2.75, "volume": 57}
        ]
        item_data = ItemData.objects.create(
            item=item, phsm=phsm_data, time_refreshed=timezone.now()
        )
        self.assertEqual(item_data.price_newest, 2.75)
        self.assertEqual(item_data.price_week_ago, 2.75)

    def test_price_fields_update_with_no_phsm(self):
        item = Item.objects.create(
            nameId=176460411, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker 4", previewUrl="https://example.com/4",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        item_data = ItemData.objects.create(
            item=item, phsm=[], time_refreshed=timezone.now()
        )
        self.assertIsNone(item_data.price_newest)
        self.assertIsNone(item_data.price_week_ago)


class PortfolioItemModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='12345')
        self.item = Item.objects.create(
            nameId=176460408, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        self.item_data = ItemData.objects.create(
            item=self.item, price_week_ago=2.50, price_newest=2.75,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}],
            time_refreshed=timezone.now()
        )
        self.portfolio_item = PortfolioItem.objects.create(
            user=self.user, item_data=self.item_data, count=5
        )

    def test_portfolio_item_creation(self):
        self.assertEqual(PortfolioItem.objects.count(), 1)

    def test_portfolio_item_existence(self):
        self.assertTrue(PortfolioItem.objects.filter(
            item_data=self.item_data).exists())

    def test_portfolio_item_deletion(self):
        self.portfolio_item.delete()
        self.assertFalse(PortfolioItem.objects.filter(
            item_data=self.item_data).exists())


class UserModelTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', password='12345')
        self.item = Item.objects.create(
            nameId=176460408, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        self.item_data = ItemData.objects.create(
            item=self.item, price_week_ago=2.50, price_newest=2.75,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}],
            time_refreshed=timezone.now()
        )
        self.portfolio_item = PortfolioItem.objects.create(
            user=self.user, item_data=self.item_data, count=5
        )

    def test_user_creation(self):
        self.assertEqual(User.objects.count(), 1)

    def test_user_portfolio(self):
        self.assertEqual(self.user.portfolio.count(), 1)

    def test_user_portfolio_item_existence(self):
        self.assertTrue(self.user.portfolio.filter(
            item_data=self.item_data).exists())

    def test_user_deletion(self):
        self.user.delete()
        self.assertFalse(User.objects.filter(username='testuser').exists())

    def test_user_login(self):
        response = self.client.post(reverse('token_obtain_pair'), {
                                    'username': 'testuser', 'password': '12345'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        # Check if the user is authenticated
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + response.data['access'])
        auth_response = self.client.get(reverse('is_authenticated'))
        self.assertEqual(auth_response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            auth_response.data['detail'] == "User is authenticated")

    def test_user_login_invalid_credentials(self):
        response = self.client.post(reverse('token_obtain_pair'), {
                                    'username': 'testuser', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_user_register(self):
        response = self.client.post(
            reverse('register'), {'username': 'newuser', 'password': 'newpassword'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_user_logout(self):
        login_response = self.client.post(reverse('token_obtain_pair'), {
                                          'username': 'testuser', 'password': '12345'})
        refresh_token = login_response.data['refresh']
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + login_response.data['access'])
        logout_response = self.client.post(
            reverse('logout'), {'refresh': refresh_token})
        self.assertEqual(logout_response.status_code,
                         status.HTTP_204_NO_CONTENT)

        # Ensure the token is blacklisted and cannot be used again
        response = self.client.post(reverse('token_refresh'), {
                                    'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

        # Check if the user is logged out
        self.client.credentials()
        auth_response = self.client.get(reverse('is_authenticated'))
        self.assertEqual(auth_response.status_code,
                         status.HTTP_401_UNAUTHORIZED)


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
            time_refreshed=timezone.now() - timedelta(days=2)
        )

    def test_get_item_data(self):
        item_data = get_item_data(name_id=176460408)
        self.assertIsNotNone(item_data)
        self.assertEqual(item_data.item.name, 'Forest Raiders Locker')

    def test_filter_items(self):
        items = filter_items(name='Forest Raiders')
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].name, 'Forest Raiders Locker')


class ViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', password='12345')
        self.item = Item.objects.create(
            nameId=176460408, appId=252490, itemType="Locker", itemCollection="Forest Raiders",
            name="Forest Raiders Locker", previewUrl="https://example.com/1",
            supplyTotalEstimated=29888, timeAccepted="2024-03-10", storePrice=2.49
        )
        self.item_data = ItemData.objects.create(
            item=self.item, price_week_ago=2.50, price_newest=2.75,
            phsm=[{"date": "2024-10-10", "median": 2.73, "volume": 57}],
            time_refreshed=timezone.now()
        )
        self.portfolio_item = PortfolioItem.objects.create(
            user=self.user, item_data=self.item_data, count=5
        )
        self.token = self.client.post(reverse('token_obtain_pair'), {
                                      'username': 'testuser', 'password': '12345'}).data['access']

    def test_get_all_items_unauthenticated(self):
        response = self.client.get(reverse('get_all_items'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('items', response.data)
        self.assertIn('names_in_portfolio', response.data)
        self.assertEqual(response.data['names_in_portfolio'], [])

    def test_get_all_items_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.get(reverse('get_all_items'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('items', response.data)
        self.assertIn('names_in_portfolio', response.data)
        self.assertEqual(response.data['names_in_portfolio'], [
                         'Forest Raiders Locker'])

    def test_get_item_details_unauthenticated(self):
        response = self.client.get(
            reverse('get_item_details'), {'nameId': 176460408})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('item', response.data)
        self.assertIn('is_in_portfolio', response.data)
        self.assertFalse(response.data['is_in_portfolio'])

    def test_get_item_details_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.get(
            reverse('get_item_details'), {'nameId': 176460408})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('item', response.data)
        if response.data['item']:
            item_data = response.data['item']
            self.assertIn('item', item_data)
            self.assertIn('priceWeekAgo', item_data)
            self.assertIn('priceNow', item_data)
            self.assertIn('phsm', item_data)
            self.assertIn('timeRefreshed', item_data)
        self.assertIn('is_in_portfolio', response.data)
        self.assertTrue(response.data['is_in_portfolio'])

    def test_get_user_portfolio_unauthenticated(self):
        response = self.client.get(reverse('get_user_portfolio'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_portfolio_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.get(reverse('get_user_portfolio'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['item_data']
                         ['item']['name'], 'Forest Raiders Locker')
        self.assertEqual(response.data[0]['count'], 5)

    def test_set_portfolio_item_count_unauthenticated(self):
        response = self.client.post(reverse('set_portfolio_item_count'), {
                                    'name': 'Forest Raiders Locker', 'count': 10})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_set_portfolio_item_count_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.post(reverse('set_portfolio_item_count'), {
                                    'name': 'Forest Raiders Locker', 'count': 10})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Portfolio item updated')
        portfolio_item = PortfolioItem.objects.get(
            user=self.user, item_data=self.item_data)
        self.assertEqual(portfolio_item.count, 10)

    def test_set_portfolio_item_count_delete(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.post(reverse('set_portfolio_item_count'), {
                                    'name': 'Forest Raiders Locker', 'count': 0})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(PortfolioItem.objects.filter(
            user=self.user, item_data=self.item_data).exists())


class UserRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_user(self):
        response = self.client.post(
            reverse('register'), {'username': 'newuser', 'password': 'newpassword'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_user_missing_fields(self):
        response = self.client.post(
            reverse('register'), {'username': 'newuser'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_existing_username(self):
        User.objects.create_user(username='existinguser', password='password')
        response = self.client.post(
            reverse('register'), {'username': 'existinguser', 'password': 'newpassword'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
