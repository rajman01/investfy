# from datetime import datetime

WTQ = 'Wallet To Quicksave'
QTW = 'Quicksave To Wallet'
BTQ = 'Bank Account To Quicksave'
QTB = 'Quicksave To Bank Account'

QUICKSAVE_TRANSACTION_TYPES = [
    (WTQ, WTQ),
    (QTW, QTW),
    (BTQ, BTQ),
    (QTB, QTB)
]

WTT = 'Wallet To Targetsave'
TTW = 'Targetsave To Wallet'
BTT = 'Bank Account To Targetsave'
TTB = 'Targetsave To Bank Account'

TARGET_SAVE_TRANSACTION_TYPES = [
   (WTT, WTT),
   (TTW, TTW),
   (BTT, BTT),
   (TTB, TTB)
]

D = 'daily'
W = 'weekly'
M = 'monthly'

JOINT_SAVING_FREQUENCY_TYPES = [
    (D, D),
    (W, W),
    (M, M)
]

WTJ = 'Wallet To Joint Save'
JTW = 'Joint Save To Wallet'

JOINT_SAVE_TRANSACTION_TYPES = [
    (WTJ, WTJ),
    (JTW, JTW)
]

def check_week(date2, date1):
    date_difference = date2 - date1
    days = date_difference.days
    if days != 0:
        if days % 7 == 0:
            return days // 7
        else:
            return (days // 7) + 1
    return 1

def check_end_of_week(date2, date1):
    date_difference = date2 - date1
    days = date_difference.days
    if days != 1:
        return (days - 1) % 7 == 0
    return False

def check_end_of_month(date2, date1):
    date_difference = date2 - date1
    days = date_difference.days
    if days != 0:
        return days % 30 == 0
    return False

    
# def check_days(date1, date2):
#     date_difference = date2 - date1
#     return date_difference.days


# def check_date(date):
#     now = datetime.date(datetime.now())
#     date_difference = now - date
#     days = date_difference.days % 28
#     month = date_difference.days // 28
#     week = (month * 4) + (days // 8) + 1
#     return {'days': days, 'month': month, 'weekday': date.weekday(), 'week': week}
