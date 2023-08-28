from celery import shared_task
from .models import Investment, PO
from wallet.models import WalletTransaction
from datetime import datetime
from decimal import Decimal
from user.tasks import send_email_task


def check_end_of_year(date2, date1):
    date_difference = date2 - date1
    days = date_difference.days
    if days != 0:
        return days % 365 == 0
    return False


@shared_task
def yearly_round_up_investment():
    for investment in Investment.objects.filter(active=True, approved=True):
        if check_end_of_year(datetime.date(datetime.now()), investment.date_approved):
            profit = Decimal(str(investment.yearly_profit_percent / 100)) * investment.amount_per_unit
            for investor in investment.investors.all():
                units = 0
                for transaction in investor.investments_transactions.filter(investment=investment):
                    units += transaction.units_bought
                if investment.payout_type == PO:
                    yearly_gain =  units * profit
                else:
                    yearly_gain =  (profit * units) + (investment.amount_per_unit * units)
                investor.wallet.balance += Decimal(str(yearly_gain))
                investor.wallet.save()
                WalletTransaction.objects.create(
                    beneficiary=investor,
                    amount=Decimal(str(yearly_gain))
                )
                body = f"Congratulation, Your yearly gain for {investment.name} investment ({yearly_gain} Naira) has been transfered to your wallet"
                email = {'body': body, 'subject': f'{investment.name} investment yearly gain', 'to': [investor.email]}
                send_email_task.delay(email)
            yearly_investors_money = Decimal(str(investment.yearly_investors_money()))
            investment.owner.wallet.balance -= yearly_investors_money
            investment.owner.wallet.save()
            body = f"Hi {investment.owner.full_name}, its {investment.name} investment Yearly round up, The Yearly investors money {str(yearly_investors_money)} naira has been deducted from your wallet. If Your wallet balance is negative, simply payup by funding your wallet. Thank You"
            email = {'body': body, 'subject': f'{investment.name} investment Yearly round up', 'to': [investment.owner.email]}
            send_email_task.delay(email)
            date_difference = datetime.date(datetime.now()) - investment.date_approved
            if date_difference.days == investment.duration * 365:
                investment.active = False
                investment.save()
                body = f"Hi {investment.owner.full_name}, Just Here to inform You that {investment.name} investment time is up, if You have any pending money to give investfy, please pay up by simple funding Your wallet. Thank You"
                email = {'body': body, 'subject': f'{investment.name} investment time up', 'to': [investment.owner.email]}
                send_email_task.delay(email)
    return None
