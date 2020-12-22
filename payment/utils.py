import requests
from decouple import config


banks = [{'id': 1, 'code': '044', 'name': 'Access Bank'}, 
         {'id': 2, 'code': '023', 'name': 'Citi Bank'},
         {'id': 4, 'code': '050', 'name': 'EcoBank PLC'}, 
         {'id': 5, 'code': '011', 'name': 'First Bank PLC'},
         {'id': 6, 'code': '214', 'name': 'First City Monument Bank'}, 
         {'id': 7, 'code': '070', 'name': 'Fidelity Bank'}, 
         {'id': 8, 'code': '058', 'name': 'Guaranty Trust Bank'}, 
         {'id': 9, 'code': '076', 'name': 'Polaris bank'}, 
         {'id': 10, 'code': '221', 'name': 'Stanbic IBTC Bank'}, 
         {'id': 11, 'code': '068', 'name': 'Standard Chaterted bank PLC'}, 
         {'id': 12, 'code': '232', 'name': 'Sterling Bank PLC'}, 
         {'id': 13, 'code': '033', 'name': 'United Bank for Africa'}, 
         {'id': 14, 'code': '032', 'name': 'Union Bank PLC'}, 
         {'id': 15, 'code': '035', 'name': 'Wema Bank PLC'}, 
         {'id': 16, 'code': '057', 'name': 'Zenith bank PLC'}, 
         {'id': 17, 'code': '215', 'name': 'Unity Bank PLC'}, 
         {'id': 18, 'code': '101', 'name': 'ProvidusBank PLC'}, 
         {'id': 183, 'code': '082', 'name': 'Keystone Bank'}, 
         {'id': 184, 'code': '301', 'name': 'Jaiz Bank'}, 
         {'id': 186, 'code': '030', 'name': 'Heritage Bank'}, 
         {'id': 231, 'code': '100', 'name': 'Suntrust Bank'}, 
         {'id': 252, 'code': '608', 'name': 'FINATRUST MICROFINANCE BANK'}, 
         {'id': 253, 'code': '090175', 'name': 'Rubies Microfinance Bank'}, 
         {'id': 254, 'code': '090267', 'name': 'Kuda'}, 
         {'id': 258, 'code': '090115', 'name': 'TCF MFB'}, 
         {'id': 259, 'code': '400001', 'name': 'FSDH Merchant Bank'}, 
         {'id': 260, 'code': '502', 'name': 'Rand merchant Bank'}, 
         {'id': 301, 'code': '103', 'name': 'Globus Bank'}, 
         {'id': 389, 'code': '327', 'name': 'Paga'}, 
         {'id': 395, 'code': '000026', 'name': 'Taj Bank Limited'}, 
         {'id': 596, 'code': '100022', 'name': 'GoMoney'}, 
         {'id': 597, 'code': '090180', 'name': 'AMJU Unique Microfinance Bank'}, 
         {'id': 638, 'code': '90393', 'name': 'BRIDGEWAY MICROFINANCE BANK'}, 
         {'id': 639, 'code': '090328', 'name': 'Eyowo MFB'}, 
         {'id': 640, 'code': '090281', 'name': 'Mint-Finex MICROFINANCE BANK'}, 
         {'id': 659, 'code': '070006', 'name': 'Covenant Microfinance Bank'}, 
         {'id': 660, 'code': '090110', 'name': 'VFD Micro Finance Bank'}, 
         {'id': 661, 'code': '090317', 'name': 'PatrickGold Microfinance Bank'}]


def resolve_account(acct_no, bank_code):
    data = {'account_number': acct_no, 'account_bank': bank_code}
    url = 'https://api.flutterwave.com/v3/accounts/resolve'
    headers = {
        'Content-Type': 'application/json', 
        'Authorization': f'Bearer {config("FLUTTERWAVE_SECRET_KEY")}'
        }
    response = requests.post(url=url, data=data, headers=headers)
    return {'data': response.json(), 'status_code': response.status_code}