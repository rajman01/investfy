from django.db import models
from django.contrib.auth import get_user_model
from .utils import CATEGORY_TYPES
from datetime import datetime

UserModel = get_user_model()

class Account(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)
    balance = models.DecimalField(decimal_places=2, max_digits=10, default='0.00')
    date = models.DateField(default=datetime.date(datetime.now()))


class Category(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=64)
    category_type = models.CharField(max_length=16, choices=CATEGORY_TYPES)

class Transaction(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(decimal_places=2, max_digits=10, default='0.00')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=16, choices=CATEGORY_TYPES)
    date = models.DateField(default=datetime.date(datetime.now()))
