# Generated by Django 5.1.3 on 2024-12-27 19:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_remove_itemdata_pricenow_itemdata_pricenewest_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='itemdata',
            old_name='priceNewest',
            new_name='price_newest',
        ),
        migrations.RenameField(
            model_name='itemdata',
            old_name='priceWeekAgo',
            new_name='price_week_ago',
        ),
    ]
