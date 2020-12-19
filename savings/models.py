from django.db import models
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save
from wallet.models import Wallet
from decimal import Decimal
from .utils import (QUICKSAVE_TRANSACTION_TYPES, TARGET_SAVE_TRANSACTION_TYPES, WTQ, WTT, 
                        JOINT_SAVING_FREQUENCY_TYPES, W, WTJ, JOINT_SAVE_TRANSACTION_TYPES)
from datetime import datetime

UserModel = get_user_model()


class QuickSave(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, related_name='quick_save')
    wallet = models.OneToOneField(Wallet, on_delete=models.CASCADE, related_name='quick_save')
    balance = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)
    autosave = models.BooleanField(default=False)
    day_interval = models.IntegerField(blank=True, null=True)
    autosave_amount = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)
    last_saved = models.DateField(blank=True, null=True)

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
    last_saved = models.DateField(blank=True, null=True)

    def deposit(self, amount):
        if self.active:
            self.progress += Decimal(str(amount))
            self.save()
            return True
        return False

    def cashout(self):
        if self.progress >= (Decimal('0.5') * self.targeted_saving):
            self.wallet.balance += self.progress
            self.progress = Decimal('0.00')
            self.targeted_saving = Decimal('0.00')
            self.active = False
            self.autosave = False
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


class JointSave(models.Model):
    name = models.CharField(max_length=64)
    admin = models.ForeignKey(UserModel, on_delete=models.DO_NOTHING, related_name='my_joint_saving', blank=True, null=True)
    members = models.ManyToManyField(UserModel, related_name='joint_savings', blank=True)
    amount = models.DecimalField(decimal_places=2, max_digits=10, default='0.00')
    total = models.DecimalField(decimal_places=2, max_digits=10, default='0.00')
    frequency = models.CharField(max_length=64, default=W, choices=JOINT_SAVING_FREQUENCY_TYPES)
    is_active = models.BooleanField(default=True)
    date_created = models.DateField(auto_now_add=True)

    def contribute(self):
        self.total += self.amount
        self.save()

    def can_disband(self):
        now = datetime.date(datetime.now())
        date_difference = now - self.date_created
        if date_difference.days < 29:
            return True
        return False

    def can_invite_member(self):
        if self.frequency == W:
            now = datetime.date(datetime.now())
            date_difference = now - self.date_created
            if date_difference.days < 8:
                return True
            return False

    def can_leave(self):
        now = datetime.date(datetime.now())
        date_difference = now - self.date_created
        if date_difference.days < 29:
            return True
        return False

    def has_all_cahsed_out(self):
        res = True
        for track in self.tracks.all():
            res = track.cashed_out
            if res == False:
                break
        return res
    
    def cash_out(self, member):
        if member in self.members.all():
            member.wallet.balance += self.total
            self.total = Decimal('0.00')
            member.wallet.save()
            self.save()


class JointSaveTransaction(models.Model):
    joint_save = models.ForeignKey(JointSave, on_delete=models.CASCADE)
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='joint_saving_transactions')
    amount =  models.DecimalField(decimal_places=2, max_digits=10)
    transaction_type = models.CharField(max_length=64, default=WTJ, choices=JOINT_SAVE_TRANSACTION_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)


class JointSaveTrack(models.Model):
    joint_save = models.ForeignKey(JointSave, on_delete=models.CASCADE, related_name='tracks')
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    cashed_out = models.BooleanField(default=False)