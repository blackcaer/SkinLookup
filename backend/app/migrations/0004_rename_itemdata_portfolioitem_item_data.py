# Generated by Django 5.1.3 on 2024-12-28 12:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_rename_pricenewest_itemdata_price_newest_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='portfolioitem',
            old_name='itemData',
            new_name='item_data',
        ),
    ]
