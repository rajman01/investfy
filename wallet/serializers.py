from rest_framework import serializers
from .models import Wallet, WalletTransaction, SavingTransaction
from django.contrib.auth import get_user_model
from user.models import User

UserModel = get_user_model()


class UserForWallet(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'first_name', 'last_name']


class WalletTransactionSerializer(serializers.ModelSerializer):
    sender = UserForWallet()
    beneficiary = UserForWallet()

    class Meta:
        model = WalletTransaction
        fields = ['sender', 'beneficiary', 'amount', 'timestamp']
        read_only_field = ['sender', 'beneficiary', 'amount', 'timestamp']


class SavingTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingTransaction
        fields = ['amount', 'savings_account', 'transaction_type', 'timestamp']
        read_only_fields = ['amount', 'savings_account', 'transaction_type', 'timestamp']


class WalletSerializer(serializers.ModelSerializer):
    owner = UserForWallet()
    sent_transactions = WalletTransactionSerializer(many=True, read_only=True, source='owner.sent_transactions')
    recieved_transactions = WalletTransactionSerializer(many=True, read_only=True, source='owner.recieved_transactions')
    savings_transactions = SavingTransactionSerializer(many=True, read_only=True, source='owner.savings_transactions')


    class Meta:
        model = Wallet
        fields = ['id', 'owner', 'balance', 'sent_transactions', 'recieved_transactions', 'savings_transactions']
        read_only_fields = ['id', 'owner', 'balance', 'sent_transactions', 'recieved_transactions', 'savings_transactions']


class SetWalletPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=4, min_length=4, write_only=True)

    def validate_password(self, password):
        if not password.isdigit():
            raise serializers.ValidationError(['password must be in digits'])
        return password

class ChangeWalletPasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(max_length=4, min_length=4, write_only=True)
    new_password = serializers.CharField(max_length=4, min_length=4, write_only=True)

    def validate_current_password(self, current_password):
        if not current_password.isdigit():
            raise serializers.ValidationError(['password must be in digits'])
        return current_password

    def validate_new_password(self, new_password):
        if not new_password.isdigit():
            raise serializers.ValidationError(['password must be in digits'])
        return new_password


class WalletTransferSerializer(serializers.Serializer):
    beneficiary = serializers.CharField(help_text='username of the beneficiary')
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    password = serializers.CharField(max_length=4, min_length=4, write_only=True)

    def validate_beneficiary(self, beneficiary):
        try:
            UserModel.objects.get(username=beneficiary)
        except UserModel.DoesNotExist:
            raise serializers.ValidationError(['user with this username does not exists'])
        return beneficiary
