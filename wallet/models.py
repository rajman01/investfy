from django.db import models
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.utils import timezone
from django.contrib.auth.models import User
import bcrypt
from decimal import Decimal
from .utils import SAVING_ACCOUNT_CHOICES, QS, SAVING_TRANACTION_CHOICES, WTS

UserModel = get_user_model()


class Wallet(models.Model):
    wallet_id = models.CharField(max_length=32, unique=True)
    owner = models.OneToOneField(UserModel, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)
    password = models.BinaryField(default=b'')

    def can_deduct(self, amount):
        amount = Decimal(str(amount))
        return self.balance >= amount

    def deduct(self, amount):
        if self.can_deduct(amount):
            amount = Decimal(str(amount))
            self.balance -= amount
            self.save()
            return True
        return False

    def transfer(self, wallet, amount):
        if self.deduct(amount):
            amount = Decimal(str(amount))
            wallet.balance += amount
            wallet.save()
            return True
        return False

    def save_to_quicksave(self, amount):
        if self.deduct(amount):
            amount = Decimal(str(amount))
            self.quick_save.balance += amount
            self.quick_save.save()
            return True
        return False

    def set_password(self, password, wallet_id):
        hashed_password = bcrypt.hashpw(password.encode('utf_8'), bcrypt.gensalt())
        self.password = hashed_password
        self.wallet_id = wallet_id
        self.save()

    def check_password(self, password):
        if self.has_password():
            return bcrypt.checkpw(password.encode('utf_8'), self.password.tobytes())
        return False
    
    def has_password(self):
        if self.password.tobytes():
            return True
        return False

        

class WalletTransaction(models.Model):
    sender = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='sent_transactions', null=True, blank=True)
    beneficiary = models.ForeignKey(UserModel, on_delete=models.DO_NOTHING, related_name='recieved_transactions')
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    timestamp = models.DateTimeField(auto_now_add=True)


class SavingTransaction(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='savings_transactions')
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    savings_account = models.CharField(max_length=64, default=QS, choices=SAVING_ACCOUNT_CHOICES)
    transaction_type = models.CharField(max_length=64, default=WTS, choices=SAVING_TRANACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)


class AccountTransaction(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='account_transactions')
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    acct_no = models.CharField(max_length=10)
    name = models.CharField(max_length=128)
    successful = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)



# Automatically creates wallet for a new user
@receiver(signal=post_save, sender=UserModel)
def create_wallet(sender, instance=None, created=False, **kwargs):
    if created:
        Wallet.objects.create(owner=instance, wallet_id=instance.username)