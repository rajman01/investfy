# Generated by Django 3.1.3 on 2021-01-21 04:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('investment', '0002_auto_20210120_2150'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='invesmenttransaction',
            options={'ordering': ['-timestamp']},
        ),
        migrations.AlterModelOptions(
            name='investment',
            options={'ordering': ['-date_create']},
        ),
    ]
