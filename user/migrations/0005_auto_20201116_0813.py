# Generated by Django 3.1.3 on 2020-11-16 08:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_auto_20201116_0737'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='dob',
            field=models.DateField(blank=True, null=True),
        ),
    ]
