# Generated by Django 3.1.3 on 2021-01-10 20:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('savings', '0020_auto_20210109_1050'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='jointsave',
            options={'ordering': ['-date_created']},
        ),
        migrations.AlterModelOptions(
            name='targetsave',
            options={'ordering': ['-date_created']},
        ),
    ]
