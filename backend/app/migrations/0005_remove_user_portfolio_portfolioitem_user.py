# Generated by Django 5.1.3 on 2024-12-28 13:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_rename_itemdata_portfolioitem_item_data'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='portfolio',
        ),
        migrations.AddField(
            model_name='portfolioitem',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='portfolio', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]