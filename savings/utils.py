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