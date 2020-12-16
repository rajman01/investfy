from rest_framework.serializers import ModelSerializer, IntegerField, Serializer, DecimalField, CharField, ValidationError, ListField
from .models import QuickSave, QuicksaveTransaction, TargetSave, TargetSavingTransaction, JointSave, JointSaveTransaction
from wallet.serializers import UserForWallet
from datetime import datetime
from decimal import Decimal
from django.contrib.auth import get_user_model

UserModel = get_user_model()


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


class SaveToJointSaveSerializer(Serializer):
    password = CharField(max_length=4, min_length=4, write_only=True)

    class Meta:
        fields = ['password']


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


class QuickSaveAutoSaveSerializer(ModelSerializer):
    class Meta:
        model = QuickSave
        fields = ['day_interval', 'autosave_amount']

    def update(self, instance, validated_data):
        if not instance.autosave:
            instance.autosave = True
            instance.day_interval = validated_data['day_interval']
            instance.autosave_amount = validated_data['autosave_amount']
            instance.last_saved = datetime.date(datetime.now())
        else:
            instance.autosave = False
            instance.day_interval = 0
            instance.autosave_amount = Decimal('0.00')
        instance.save()
        return instance


class TargetSaveAutosaveSerializer(ModelSerializer):
    class Meta:
        model = TargetSave
        fields = ['day_interval', 'autosave_amount']

    def update(self, instance, validated_data):
        if instance.active:
            if not instance.autosave:
                instance.autosave = True
                instance.day_interval = validated_data['day_interval']
                instance.autosave_amount = validated_data['autosave_amount']
                instance.last_saved = datetime.date(datetime.now())
            else:
                instance.autosave = False
                instance.day_interval = 0
                instance.autosave_amount = Decimal('0.00')
            instance.save()
        return instance


class JointSaveTransactionSerializer(ModelSerializer):
    class Meta:
        model = JointSaveTransaction
        fields = ['amount', 'transaction_type', 'timestamp']


class JointSaveMemberSerializer(ModelSerializer):
    transactions = JointSaveTransactionSerializer(many=True, source='joint_saving_transactions')

    class Meta:
        model = UserModel
        fields = ['id', 'username', 'full_name', 'first_name', 'last_name', 'transactions']


class JointSaveSerializer(ModelSerializer):
    admin = UserForWallet()
    members = JointSaveMemberSerializer(many=True)

    class Meta:
        model = JointSave
        fields = ['id', 'name', 'admin', 'amount', 'total', 'frequency', 'date_created', 'members']


class CreateJointSaveSerializer(ModelSerializer):
    members = ListField(min_length=2)


    class Meta:
        model = JointSave
        fields = ['name', 'members', 'amount']

    def validate_members(self, members):
        for username in members:
            try:
                UserModel.objects.get(username=username)
            except UserModel.DoesNotExist:
                raise ValidationError(f'user with {username} does not exists')
        return members

    def create(self, validated_data):
        admin = self.context['user']
        name = validated_data['name']
        amount = validated_data['amount']
        jointsave = JointSave.objects.create(
            name=name,
            admin=admin,
            amount=amount
        )
        jointsave.members.add(admin)
        jointsave.save()
        return jointsave


class AcceptJointSaveSerializer(Serializer):
    token = CharField(max_length=528)

    class Meta:
        fields = ['token']