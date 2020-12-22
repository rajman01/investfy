from rest_framework import serializers
from .models import Wallet, WalletTransaction, SavingTransaction
from django.contrib.auth import get_user_model


UserModel = get_user_model()


class UserForWallet(serializers.ModelSerializer):
    wallet_id = serializers.CharField(source='wallet.wallet_id')

    class Meta:
        model = UserModel
        fields = ['id', 'username', 'full_name', 'first_name', 'last_name', 'wallet_id']


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
        fields = ['id', 'owner', 'wallet_id', 'balance', 'sent_transactions', 'recieved_transactions', 'savings_transactions']
        read_only_fields = ['id', 'wallet_id', 'owner', 'balance', 'sent_transactions', 'recieved_transactions', 'savings_transactions']


class SetWalletPasswordSerializer(serializers.ModelSerializer):
    wallet_id = serializers.CharField(max_length=32)
    password = serializers.CharField(max_length=4, min_length=4, write_only=True)

    class Meta:
        model = Wallet
        fields = ['wallet_id', 'password']

    def validate_password(self, password):
        if not password.isdigit():
            raise serializers.ValidationError(['password must be in digits'])
        return password

    def validate_wallet_id(self, wallet_id):
        check_query = Wallet.objects.filter(wallet_id=wallet_id)
        if self.instance:
            check_query = check_query.exclude(pk=self.instance.pk)
        if check_query.exists():
            raise serializers.ValidationError(f'user with this wallet_id {wallet_id} already exists')
        return wallet_id


class ChangeWalletPasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(max_length=4, min_length=4, write_only=True)
    new_password = serializers.CharField(max_length=4, min_length=4, write_only=True)

    class Meta:
        fields = ['current_password', 'new_password']

    def validate_current_password(self, current_password):
        if not current_password.isdigit():
            raise serializers.ValidationError('password must be in digits')
        return current_password

    def validate_new_password(self, new_password):
        if not new_password.isdigit():
            raise serializers.ValidationError('password must be in digits')
        return new_password


class WalletTransferSerializer(serializers.Serializer):
    wallet_id = serializers.CharField(help_text='beneficiary wallet_id', max_length=32)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    password = serializers.CharField(max_length=4, min_length=4, write_only=True)

    class Meta:
        fields = ['wallet_id', 'amount', 'password']

    def validate_wallet_id(self, wallet_id):
        try:
            Wallet.objects.get(wallet_id=wallet_id)
        except Wallet.DoesNotExist:
            raise serializers.ValidationError(f'user with this wallet_id {wallet_id} does not exists')
        return wallet_id


class ChangeWalletIDSerializer(serializers.ModelSerializer):
    wallet_id = serializers.CharField(max_length=32)
    
    class Meta:
        model = Wallet
        fields = ['wallet_id']

    def validate_wallet_id(self, wallet_id):
        check_query = Wallet.objects.filter(wallet_id=wallet_id)
        if self.instance:
            check_query = check_query.exclude(pk=self.instance.pk)
        if check_query.exists():
            raise serializers.ValidationError(f'user with this wallet_id {wallet_id} already exists')
        return wallet_id

    def update(self, instance, validated_data):
        instance.wallet_id = validated_data['wallet_id']
        instance.save()
        return instance