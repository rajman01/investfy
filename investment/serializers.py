from rest_framework import serializers
from wallet.serializers import UserForWallet
from .models import Investment, InvesmentTransaction, C_P, PO
from decimal import Decimal

class InvesmentTransactionSerializer(serializers.ModelSerializer):
    user = UserForWallet()

    class Meta:
        model = InvesmentTransaction
        fields = ['id', 'user', 'amount', 'units_bought', 'timestamp']

class InvestmentForOwner(serializers.ModelSerializer):
    owner = UserForWallet()
    transactions = InvesmentTransactionSerializer(many=True)
    data_type = serializers.SerializerMethodField('get_type')


    class Meta:
        model = Investment
        fields = ['id', 'name', 'description', 'owner', 'investment_type', 'payout_type', 'units', 'units_left',
                    'amount_per_unit', 'approved', 'active', 'total_amount', 'yearly_profit_percent', 'no_of_investors', 'duration', 
                    'date_create', 'date_approved', 'sold_out', 'yearly_investors_money', 'transactions', 'data_type', ]
    
    def get_type(self, obj):
        return 'investment for owner'


class InvestmentForInvestors(serializers.ModelSerializer):
    owner = UserForWallet()
    transactions = serializers.SerializerMethodField('get_transactions')
    yearly_gain = serializers.SerializerMethodField('get_yearly_gain')
    yearly_profit = serializers.SerializerMethodField('get_yearly_profit')
    units_bought = serializers.SerializerMethodField('get_units_bought')
    data_type = serializers.SerializerMethodField('get_type')

    class Meta:
        model = Investment
        fields = ['id', 'name', 'description', 'owner', 'investment_type', 'payout_type', 'units', 'units_left', 'yearly_profit', 'yearly_gain',
                   'units_bought', 'amount_per_unit', 'yearly_profit_percent', 'no_of_investors', 'duration', 'sold_out', 'transactions', 'data_type', 'date_approved']

    def get_transactions(self, obj):
        investor = self.context.get('investor')
        queryset = obj.transactions.filter(user=investor)
        serializer = InvesmentTransactionSerializer(queryset, many=True)
        return serializer.data

    def get_yearly_gain(self, obj):
        investor = self.context.get('investor')
        units = 0
        profit = Decimal(str(obj.yearly_profit_percent / 100)) * obj.amount_per_unit
        for transaction in investor.investments_transactions.filter(investment=obj):
            units += transaction.units_bought
        if obj.payout_type == PO:
            return units * profit
        else:
            return (profit * units) + (obj.amount_per_unit * units)

    def get_yearly_profit(self, obj):
        investor = self.context.get('investor')
        units = 0
        profit = Decimal(str(obj.yearly_profit_percent / 100)) * obj.amount_per_unit
        for transaction in investor.investments_transactions.filter(investment=obj):
            units += transaction.units_bought
        return units * profit

    def get_units_bought(self, obj):
        investor = self.context.get('investor')
        units = 0
        for transaction in investor.investments_transactions.filter(investment=obj):
            units += transaction.units_bought
        return units
    
    def get_type(self, obj):
        return 'investment for investors'

class InvestmentSerializer(serializers.ModelSerializer):
    owner = UserForWallet()
    data_type = serializers.SerializerMethodField('get_type')

    class Meta:
        model = Investment
        fields = ['id', 'name', 'description', 'owner', 'investment_type', 'payout_type', 'units', 'units_left',
                    'amount_per_unit', 'yearly_profit_percent', 'no_of_investors', 'duration', 'sold_out', 'data_type', 'date_approved']

    def get_type(self, obj):
        return 'normal'


class CreateInvestorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = ['name', 'description', 'payout_type', 'units', 'amount_per_unit', 'yearly_profit_percent', 'duration']

    def validate_yearly_profit_percent(self, yearly_profit_percent):
        if yearly_profit_percent < 20 or yearly_profit_percent > 200:
            raise serializers.ValidationError(f'must be between 20 and 200')
        return yearly_profit_percent

    def validate_duration(self, duration):
        if duration < 1:
            raise serializers.ValidationError(f'can\'t be less than 1')
        return duration

    def create(self, validated_data):
        owner = self.context.get('owner')
        investment = Investment.objects.create(
            owner=owner,
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
        