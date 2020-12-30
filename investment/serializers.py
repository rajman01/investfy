from rest_framework import serializers
from wallet.serializers import UserForWallet
from .models import Investment, InvesmentTransaction, C_P, PO

class InvesmentTransactionSerializer(serializers.ModelSerializer):
    user = UserForWallet()

    class Meta:
        model = InvesmentTransaction
        fields = ['user', 'amount', 'unit_bougth', 'timestamp']

class InvestmentForOwner(serializers.ModelSerializer):
    owner = UserForWallet()
    transactions = InvesmentTransactionSerializer(many=True)

    class Meta:
        model = Investment
        fields = ['name', 'description', 'owner', 'investment_type', 'payout_type', 'units', 'units_left',
                    'amount_per_unit', 'approved', 'active', 'yearly_profit_percent', 'no_of_investors', 'duration', 
                    'date_created', 'sold_out', 'yearly_investors_money', 'transactions']


class InvestmentForInvestors(serializers.ModelSerializer):
    owner = UserForWallet()
    transactions = serializers.SerializerMethodField('get_transactions')
    yearly_profit = serializers.SerializerMethodField('get_profit')

    class Meta:
        model = Investment
        fields = ['name', 'description', 'owner', 'investment_type', 'payout_type', 'units', 'units_left', 'profit'
                    'amount_per_unit', 'yearly_profit_percent', 'no_of_investors', 'duration', 'sold_out', 'transactions']

    def get_transactions(self, obj):
        investor = self.context.get('investor')
        queryset = obj.transactions.filter(user=investor)
        serializer = InvesmentTransactionSerializer(queryset, many=True)
        return serializer.data

    def get_profit(self, obj):
        investor = self.context.get('investor')
        units = 0
        profit = (self.yearly_profit_percent / 100) * self.amount_per_unit
        for transaction in investor.investments_transactions.filter(investment=obj):
            units += transaction.units
        if obj.payout_type == PO:
            return units * profit
        else:
            return (profit * units) + (obj.amount_per_unit * units)

class InvestmentSerializer(serializers.ModelSerializer):
     owner = UserForWallet()

     class Meta:
        model = Investment
        fields = ['name', 'description', 'owner', 'investment_type', 'payout_type', 'units', 'units_left',
                    'amount_per_unit', 'yearly_profit_percent', 'no_of_investors', 'duration', 'sold_out']


class CreateInvestorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = ['name', 'description', 'payout_type', 'units', 'amount_per_unit', 'yearly_profit_percent', 'duration']

    def validate_yearly_profit_percent(self, yearly_profit_percent):
        if yearly_profit_percent < 5 or yearly_profit_percent > 100:
            return serializers.ValidationError(f'must be between 5 and 100')
        return yearly_profit_percent

    def validate_duration(self, duration):
        if duration < 1:
            return serializers.ValidationError(f'can\'t be less than 1')

    def create(self, validated_data):
        owner = self.context.get('owner')
        investment = Investment.objects.create(
            name=validated_data['name'],
            description=validated_data['description'],
            payout_type=validated_data['payout_type'],
            units=validated_data['units'],
            units_left=validated_data['units'],
            amount_per_unit=validated_data['amount_per_unit'],
            yearly_profit_percent=validated_data['yearly_profit_percent'],
            duration=validated_data['duration']
        )
        return investment


class InvestSerializer(serializers.Serializer):
    units = serializers.IntegerField()
    password = serializers.CharField()

    class Meta:
        fields = ['units', 'password']
        