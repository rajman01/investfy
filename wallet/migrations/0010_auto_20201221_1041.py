# Generated by Django 3.1.3 on 2020-12-21 09:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0009_wallet_wallet_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wallet',
            name='wallet_id',
            field=models.CharField(max_length=32, unique=True),
        ),
    ]
