# Generated by Django 3.1.3 on 2020-11-19 01:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('wallet', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wallettransaction',
            name='giver',
        ),
        migrations.AddField(
            model_name='wallettransaction',
            name='sender',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='wallet_transactions', to='user.user'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='wallettransaction',
            name='beneficiary',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
    ]