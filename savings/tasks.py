from random import randint
from celery import shared_task
from .models import  QuickSave, QuicksaveTransaction, TargetSave, TargetSavingTransaction, JointSave, JointSaveTransaction, JointSaveTrack
from wallet.models import SavingTransaction
import datetime
from datetime import datetime
from .utils import QTW, WTQ, TTW, WTT,JTW, check_end_of_week, check_week, check_end_of_month
from wallet.utils import WTS, STW, QS, TS, JS
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from user.tasks import send_email_task
from user.views import GLOBAL_CURRENT_SITE


UserModel = get_user_model()


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
    autosave_accounts = TargetSave.objects.filter(joint=False, autosave__active=True)
    for account in autosave_accounts:
        autosave = account.autosave
        check_date = datetime.date(datetime.now()) - autosave.last_saved
        if check_date.days == autosave.day_interval:
            amount = autosave.autosave_amount
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
                    autosave.last_saved = datetime.date(datetime.now())
                    autosave.save()
    return None


@shared_task
def send_joint_save_invite(members, joint_save_id, current_site):
    for username in members:
        user = UserModel.objects.get(username=username)
        token = RefreshToken.for_user(user)
        token['joint_save_id'] = joint_save_id
        joint_save = JointSave.objects.get(id=joint_save_id)
        relative_link = reverse('accept-joint-saving')
        absurl = 'http://' + current_site + relative_link + '?token=' + str(token)
        body = f"Hi {user.full_name}, {joint_save.admin.username} invited you to join {joint_save.name} joint save. click this link to join \n {absurl} \n the link will expire in 24hrs"
        email = {'body': body, 'subject': 'Accept joint saving', 'to': [user.email]}
        send_email_task(email)
    return None


@shared_task
def send_disband_email_task(name, emails):
    body = f"{name} joint save as been disbanded"
    if emails:
        send_email_task({'body': body, 'subject': 'Joint Save Disbaned', 'to': emails})
    return None


@shared_task
def joint_save_weekly_round_up():
    joint_savings = JointSave.objects.filter(is_active=True)
    for joint_save in joint_savings:
        if check_end_of_week(datetime.date(datetime.now()), joint_save.date_created):
            amount = joint_save.amount
            for member in joint_save.members.all():
                wallet = member.wallet
                transactions = JointSaveTransaction.objects.filter(user=member, joint_save=joint_save)
                if not transactions.exists():
                    wallet.balance -= joint_save.amount
                    joint_save.contribute()
                    JointSaveTransaction.objects.create(
                        joint_save=joint_save,
                        user=member,
                        amount=amount
                    )
                    SavingTransaction.objects.create(
                        user=member,
                        amount=amount,
                        savings_account=JS,
                        transaction_type=WTS
                    )
                else:
                    latest_transaction = transactions.latest('timestamp')
                    if check_week(datetime.date(latest_transaction.timestamp), joint_save.date_created) != (check_week(datetime.date(datetime.now()), joint_save.date_created) - 1):
                        wallet.balance -= joint_save.amount
                        joint_save.contribute()
                        JointSaveTransaction.objects.create(
                            joint_save=joint_save,
                            user=member,
                            amount=amount
                        )
                        SavingTransaction.objects.create(
                            user=member,
                            amount=amount,
                            savings_account=JS,
                            transaction_type=WTS
                        )
    return None
    


@shared_task
def joint_save_monthly_check_up():
    joint_savings = JointSave.objects.filter(is_active=True)
    for joint_save in joint_savings:   
        if check_end_of_month(datetime.date(datetime.now()), joint_save.date_created):
        # if True:
            non_cashed_out = joint_save.get_non_cashed_out()
            random_member = non_cashed_out[randint(0, len(non_cashed_out)-1)]
            track = JointSaveTrack.objects.filter(joint_save=joint_save, user=random_member).first()
            amount = joint_save.cash_out(random_member)
            track.cashed_out = True
            track.save()
            JointSaveTransaction.objects.create(
                joint_save=joint_save,
                user=random_member,
                amount=amount,
                transaction_type=JTW
            )
            SavingTransaction.objects.create(
                user=random_member,
                amount=amount,
                savings_account=JS,
                transaction_type=STW
            )
            body = f"Congratulation {random_member.full_name},  its you turn to cash out from {joint_save.name} joint saving, {amount} has been transfered to wallet"
            email = {'body': body, 'subject': f'{joint_save.name} cash out', 'to': [random_member.email]}
            send_email_task(email)
            if joint_save.has_all_cahsed_out():
                joint_save.is_active = False
                joint_save.save()
                for track in joint_save.tracks.all():
                    track.cashed_out = False
                    track.save()
                if joint_save.admin:
                    token = RefreshToken.for_user(joint_save.admin)
                    token['joint_save_id'] = joint_save.id
                    relative_link = reverse('Re-activate-joint-saving')
                    absurl = 'http://' + GLOBAL_CURRENT_SITE + relative_link + '?token=' + str(token)
                    body = f"Hi {joint_save.admin.full_name}, Your {joint_save.name} joint savings has been completed. click the link below to re-activate. ignore if you think other wise \n {absurl}"
                    email = {'body': body, 'subject': 'Re-activate joint saving', 'to': [joint_save.admin.email]}
                    send_email_task(email)
    return None