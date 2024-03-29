# Generated by Django 3.1.3 on 2020-12-15 17:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('savings', '0009_auto_20201215_1640'),
    ]

    operations = [
        migrations.CreateModel(
            name='JointSaveTransaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('transaction_types', models.CharField(choices=[('wallet to joint save', 'wallet to joint save'), ('joint save to wallet', 'joint save to wallet')], default='wallet to joint save', max_length=64)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.RenameModel(
            old_name='JointSaving',
            new_name='JointSave',
        ),
        migrations.DeleteModel(
            name='JointSavingTransaction',
        ),
        migrations.AddField(
            model_name='jointsavetransaction',
            name='joint_saving',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='savings.jointsave'),
        ),
        migrations.AddField(
            model_name='jointsavetransaction',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='joint_saving_transactions', to=settings.AUTH_USER_MODEL),
        ),
    ]
