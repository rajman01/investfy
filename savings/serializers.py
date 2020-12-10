from rest_framework.serializers import ModelSerializer, IntegerField, Serializer, DecimalField, CharField
from .models import QuickSave, QuicksaveTransaction, TargetSave, TargetSavingTransaction
from wallet.serializers import UserForWallet

class QuicksaveTransactionSerializer(ModelSerializer):
    # user = UserForWallet()
    # quicksave_id = IntegerField(source='quicksave.id')

    class Meta:
        model = QuicksaveTransaction
        fields = ['amount', 'transaction_type', 'timestamp']


class QuickSaveSerializer(ModelSerializer):
    user = UserForWallet()
    transactions = QuicksaveTransactionSerializer(many=True)

    class Meta:
        model = QuickSave
        fields = ['user', 'balance', 'autosave', 'day_interval', 'transactions']


class SaveSerializer(Serializer):
    amount = DecimalField(max_digits=10, decimal_places=2)
    password = CharField(max_length=4, min_length=4, write_only=True)

    class Meta:
        fields = ['amount', 'password']



class TargeSaveTransactionSerializer(ModelSerializer):
    class Meta:
        model = TargetSavingTransaction
        fields = ['amount', 'transaction_type', 'timestamp']


class TargetSaveSerializer(ModelSerializer):
    user = UserForWallet()
    transactions = TargeSaveTransactionSerializer(many=True)

    class Meta:
        model = TargetSave
        fields = ['user', 'targeted_saving', 'progress', 'active', 'autosave', 'day_interval', 'transactions']


class SetTargetSerializer(Serializer):
    amount = DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        fields = ['amount'] 