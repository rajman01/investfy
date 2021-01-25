import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investfy.settings')
django.setup()

from payment.models import Bank
from payment.utils import banks

for bank in banks:
    x = Bank.objects.create(
        name=bank.get('name'),
        code=bank.get('code')
    )
