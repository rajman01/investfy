from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from decimal import Decimal

class User(AbstractUser):
    full_name = models.CharField(max_length=60)
    phone_number = models.CharField(max_length=11, unique=True, null=True, blank=True)
    email_verified = models.BooleanField(default=False)
    bvn_verified = models.BooleanField(default=False)
    dob = models.DateField(blank=True, null=True)

    def total_savings(self):
        amount = Decimal('0.00')
        for transaction in self.savings_transactions.all():
            amount += transaction.amount
        return amount

    def total_investments(self):
        amount = Decimal('0.00')
        for transaction in self.investments_transactions.all():
            amount += transaction.amount
        return amount

User._meta.get_field('email')._unique = True