# Generated by Django 3.1.3 on 2020-12-18 14:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('savings', '0012_auto_20201217_2342'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jointsavetransaction',
            name='joint_save',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='savings.jointsave'),
        ),
    ]
