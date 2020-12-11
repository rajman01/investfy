from celery import shared_task
from .models import  QuickSave, QuicksaveTransaction, TargetSave, TargetSavingTransaction
from wallet.models import SavingTransaction
import datetime
from datetime import datetime
from .utils import QTW, WTQ, TTW, WTT
from wallet.utils import WTS, STW, QS, TS, JS


@shared_task
def quicksave_autosave_task():
    autosave_accounts = QuickSave.objects.filter(autosave=True)
    for account in autosave_accounts:
        check_date = datetime.date(datetime.now()) - account.last_saved
        if check_date.days == account.day_interval:
            amount = account.autosave_amount
            if account.wallet.save_to_quicksave(amount):
                QuicksaveTransaction.objects.create(
                    user=account.user,
                    quicksave=account,
                    amount=amount,
                    transaction_type=WTQ
                )
                SavingTransaction.objects.create(
                    user=account.user,
                    amount=amount,
                    savings_account=QS,
                    transaction_type=WTS
                )
                account.last_saved = datetime.date(datetime.now())
                account.save()
    return None


@shared_task
def targetsave_autosave_task():
    autosave_accounts = TargetSave.objects.filter(autosave=True)
    for account in autosave_accounts:
        check_date = datetime.date(datetime.now()) - account.last_saved
        if check_date.days == account.day_interval:
            amount = account.autosave_amount
            wallet = account.wallet
            if wallet.can_deduct(amount):
                if account.deposit(amount):
                    wallet.deduct(amount)
                    TargetSavingTransaction.objects.create(
                        user=account.user,
                        target_save=account,
                        amount=amount,
                        transaction_type=WTT
                    )
                    SavingTransaction.objects.create(
                        user=account.user,
                        amount=amount,
                        savings_account=TS,
                        transaction_type=WTS
                    )
                    account.last_saved = datetime.date(datetime.now())
                    account.save()
    return None

