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
    name = models.CharField(max_length=64, null=True, blank=True)
    description = models.CharField(max_length=128, null=True, blank=True)
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='target_savings')
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='target_savings')
    targeted_amount = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)
    progress = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)
    joint = models.BooleanField(default=False)
    members = models.ManyToManyField(UserModel, related_name='joint_target_savings', blank=True)
    date_created = models.DateField(auto_now_add=True)


    def deposit(self, amount):
        self.progress += Decimal(str(amount))
        self.save()

    def cashout(self):
        if self.progress >= (Decimal('0.5') * self.targeted_amount):
            self.wallet.balance += self.progress
            self.progress = Decimal('0.00')
            self.targeted_amount = Decimal('0.00')
            if not self.joint:
                self.autosave.active = False
                self.autosave.save()
            self.wallet.save()
            self.save()
            return True
        return False

    def can_delete(self):
        return self.progress < (Decimal('0.25') * self.targeted_amount)



class TargetSaveAutoSave(models.Model):
    target_save = models.OneToOneField(TargetSave, on_delete=models.CASCADE, related_name='autosave')
    active = models.BooleanField(default=False)
    day_interval = models.IntegerField(blank=True, null=True)
    autosave_amount = models.DecimalField(default=0.00, decimal_places=2, max_digits=10)
    last_saved = models.DateField(blank=True, null=True)


@receiver(signal=post_save, sender=TargetSave)
def create_target_save_autosave(sender, instance=None, created=False, **kwargs):
    if created and not instance.joint:
        TargetSaveAutoSave.objects.create(target_save=instance)


class TargetSavingTransaction(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='target_saving_transactions')
    target_save = models.ForeignKey(TargetSave, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    transaction_type = models.CharField(default=WTT, choices=TARGET_SAVE_TRANSACTION_TYPES, max_length=64)
    timestamp = models.DateTimeField(auto_now_add=True)


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

    def get_non_cashed_out(self):
        res = []
        for member in self.members.all():
            track = member.joint_save_tracks.filter(joint_save=self).first()
            if not track.cashed_out:
                res.append(member)
        return res



class JointSaveTransaction(models.Model):
    joint_save = models.ForeignKey(JointSave, on_delete=models.CASCADE, related_name='transactions')
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='joint_saving_transactions')
    amount =  models.DecimalField(decimal_places=2, max_digits=10)
    transaction_type = models.CharField(max_length=64, default=WTJ, choices=JOINT_SAVE_TRANSACTION_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)


class JointSaveTrack(models.Model):
    joint_save = models.ForeignKey(JointSave, on_delete=models.CASCADE, related_name='tracks')
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='joint_save_tracks')
    cashed_out = models.BooleanField(default=False)