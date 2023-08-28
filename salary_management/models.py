from django.db import models
from django.contrib.auth import get_user_model
from .utils import CATEGORY_TYPES
from datetime import datetime
from django.utils import timezone

UserModel = get_user_model()

class Account(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="managements")
    name = models.CharField(max_length=64)
    balance = models.DecimalField(decimal_places=2, max_digits=10, default='0.00')
    description = models.TextField(blank=True, null=True)
    date = models.DateField(auto_now_add=True)


class Category(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=64)
    description = models.TextField(blank=True, null=True)
    category_type = models.CharField(max_length=16, choices=CATEGORY_TYPES)

class Transaction(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(decimal_places=2, max_digits=10, default='0.00')
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=16, choices=CATEGORY_TYPES)
    date = models.DateTimeField(default=timezone.now)
