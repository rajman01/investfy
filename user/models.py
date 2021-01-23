from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from decimal import Decimal
from savings.utils import WTJ

class User(AbstractUser):
    full_name = models.CharField(max_length=60)
    phone_number = models.CharField(max_length=11, unique=True, null=True, blank=True)
    email_verified = models.BooleanField(default=False)
    bvn_verified = models.BooleanField(default=False)
    dob = models.DateField(blank=True, null=True)

    def total_savings(self):
        amount = Decimal('0.00')
        amount += self.quick_save.balance
        for target_save in self.target_savings.all():
            amount += target_save.progress
        for joint_save in self.joint_savings.filter(is_active=True):
            for transaction in joint_save.transactions.filter(user=self):
                if transaction.transaction_type == WTJ:
                    amount += transaction.amount
                else:
                    amount -= transaction.amount
        return amount

    def total_investments(self):
        amount = Decimal('0.00')
        for transaction in self.investments_transactions.filter(investment__active=True, investment__approved=True):
                amount += transaction.amount
        return amount

User._meta.get_field('email')._unique = True