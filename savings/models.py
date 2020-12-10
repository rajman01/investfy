from django.db import models
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save
from wallet.models import Wallet
from decimal import Decimal
from .utils import QUICKSAVE_TRANSACTION_TYPES, TARGET_SAVE_TRANSACTION_TYPES, WTQ, WTT

UserModel = get_user_model()


class QuickSave(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, related_name='quick_save')
    wallet = models.OneToOneField(Wallet, on_delete=models.CASCADE, related_name='quick_save')
    balance = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)
    autosave = models.BooleanField(default=False)
    day_interval = models.IntegerField(blank=True, null=True)
    autosave_amount = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)

    def cashout(self):
        if self.balance > Decimal('0.00'):
            self.wallet.balance += self.balance
            self.balance = Decimal('0.00')
            self.wallet.save()
            self.save()
            return True
        return False


class QuicksaveTransaction(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    quicksave = models.ForeignKey(QuickSave, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    transaction_type = models.CharField(default=WTQ, choices=QUICKSAVE_TRANSACTION_TYPES, max_length=64)
    timestamp = models.DateTimeField(auto_now_add=True)



@receiver(signal=post_save, sender=UserModel)
def create_quick_save(sender, instance=None, created=False, **kwargs):
    if created:
        QuickSave.objects.create(user=instance, wallet=instance.wallet)


class TargetSave(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, related_name='target_save')
    wallet = models.OneToOneField(Wallet, on_delete=models.CASCADE, related_name='target_save')
    targeted_saving = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)
    progress = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)
    active = models.BooleanField(default=False)
    autosave = models.BooleanField(default=False)
    day_interval = models.IntegerField(blank=True, null=True)
    autosave_amount = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)

    def deposit(self, amount):
        if self.active:
            self.progress += Decimal(str(amount))
            self.save()
            return True
        return False

    def cashout(self):
        if self.progress > (Decimal('0.5') * self.targeted_saving):
            self.wallet.balance += self.progress
            self.progress = Decimal('0.00')
            self.targeted_saving = Decimal('0.00')
            self.active = False
            self.wallet.save()
            self.save()
            return True
        return False

    def set_target(self, amount):
        if Decimal(str(amount)) > self.targeted_saving:
            self.targeted_saving = Decimal(str(amount))
            if not self.active:
                self.active = True
            self.save()
            return True
        return False


class TargetSavingTransaction(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    target_save = models.ForeignKey(TargetSave, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    transaction_type = models.CharField(default=WTT, choices=TARGET_SAVE_TRANSACTION_TYPES, max_length=64)
    timestamp = models.DateTimeField(auto_now_add=True)


@receiver(signal=post_save, sender=UserModel)
def create_target_save(sender, instance=None, created=False, **kwargs):
    if created:
        TargetSave.objects.create(user=instance, wallet=instance.wallet)


class JointSaving(models.Model):
    # owner = models.ForeignKey(UserModel, on_delete=models.DO_NOTHING, related_name='joint_saving')
    # members = models.ManyToOneRel(UserModel, related_name='joint')
    pass


