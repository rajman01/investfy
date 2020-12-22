# from datetime import datetime

WTQ = 'wallet to quicksave'
QTW = 'quicksave to wallet'
BTQ = 'bank account to quicksave'
QTB = 'quicksave to bank account'

QUICKSAVE_TRANSACTION_TYPES = [
    (WTQ, WTQ),
    (QTW, QTW),
    (BTQ, BTQ),
    (QTB, QTB)
]

WTT = 'wallet to targetsave'
TTW = 'targetsave to wallet'
BTT = 'bank account to targetsave'
TTB = 'targetsave to bank account'

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

WTJ = 'wallet to joint save'
JTW = 'joint save to wallet'

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
    days = date_difference.days
    if days != 1 and days != 2:
        return (days - 2) % 28 == 0
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
