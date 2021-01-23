from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal

UserModel = get_user_model()

FI = 'fixed income'
C_P = 'capital + profit'
PO ='profit'

PAYOUT_TYPES = (
    (C_P, C_P),
    (PO, PO)
)

INVESTMENT_TYPES = (
    (FI, FI),
)

class Investment(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField()
    owner = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="my_investments")
    investment_type = models.CharField(max_length=32, default=FI, choices=INVESTMENT_TYPES)
    payout_type = models.CharField(max_length=32, choices=PAYOUT_TYPES)
    units = models.IntegerField()
    units_left = models.IntegerField()
    amount_per_unit = models.DecimalField(decimal_places=2, max_digits=10)
    total_amount = models.DecimalField(decimal_places=2, max_digits=10, default=Decimal('0.00'))
    approved = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    yearly_profit_percent = models.IntegerField()
    investors = models.ManyToManyField(UserModel, blank=True, related_name="investments")
    duration = models.IntegerField()
    date_create = models.DateField(auto_now_add=True)
    date_approved = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-date_create']

    def sold_out(self):
        return self.units_left == 0

    def yearly_investors_money(self):
        profit = Decimal(str(self.yearly_profit_percent / 100)) * self.amount_per_unit
        unit_sold = self.units - self.units_left
        if self.payout_type == C_P:
            return (profit * unit_sold) + (self.amount_per_unit * unit_sold)
        else: 
            return profit * unit_sold

    def no_of_investors(self):
        return self.investors.count()

    def invest(self, units, user):
        if units <= self.units_left:
            self.units_left -= units
            self.total_amount += units * self.amount_per_unit
            if user not in self.investors.all():
                self.investors.add(user)
            self.save()
            return True
        return False



class InvesmentTransaction(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="investments_transactions")
    investment = models.ForeignKey(Investment, on_delete=models.DO_NOTHING, related_name="transactions")
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    units_bought = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']