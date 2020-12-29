from rest_framework.serializers import ModelSerializer, CharField, ValidationError, Serializer, DecimalField
from .models import Bank, Account
from wallet.serializers import UserForWallet

class BankSerializer(ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'name', 'code']


class AccountSerializer(ModelSerializer):
    user = UserForWallet()
    bank = BankSerializer()

    class Meta:
        model = Account
        fields = '__all__'

class CreateAccountSerializer(ModelSerializer):
    bank_code = CharField(max_length=32)

    class Meta:
        model = Account
        fields = ['bank_code', 'number', 'name']

    def validate_bank_code(self, bank_code):
        try:
            Bank.objects.get(code=bank_code)
        except Bank.DoesNotExist:
            raise ValidationError('invalid bank code')
        return bank_code

    def create(self, validated_data):
        name = validated_data['name']
        number = validated_data['number']
        bank = Bank.objects.get(code=validated_data['bank_code'])
        user = self.context.get('user')

        account = Account.objects.create(
            name=name,
            number=number,
            user=user,
            bank=bank
        )
        return account

class AcountDetailsSerializer(Serializer):
    acct_no = CharField(max_length=10)
    bank_code = CharField(max_length=16)

    class Meta:
        fields = ['acct_no', 'bank_code']

    def validate_bank_code(self, bank_code):
        try:
            Bank.objects.get(code=bank_code)
        except Bank.DoesNotExist:
            raise ValidationError('invalid bank code')
        return bank_code


class MakePaymentSerializer(Serializer):
    acct_no = CharField(max_length=10)
    amount = DecimalField(max_digits=10, decimal_places=2)
    password = CharField(max_length=4, min_length=4, write_only=True)
    bank_code = CharField(max_length=16)
    name = CharField(max_length=64)

    class Meta:
        fields = ['acct_no', 'amount', 'bank_code', 'password', 'name']

    def validate_bank_code(self, bank_code):
        try:
            Bank.objects.get(code=bank_code)
        except Bank.DoesNotExist:
            raise ValidationError('invalid bank code')
        return bank_code
    