from rest_framework.serializers import (ModelSerializer, IntegerField, Serializer, DecimalField, 
                                        CharField, ValidationError, ListField, BooleanField, SerializerMethodField)
from .models import QuickSave, QuicksaveTransaction, TargetSave, TargetSavingTransaction, JointSave, JointSaveTransaction, TargetSaveAutoSave
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
        fields = ['id','amount', 'transaction_type', 'timestamp']


class QuickSaveSerializer(ModelSerializer):
    user = UserForWallet()
    transactions = QuicksaveTransactionSerializer(many=True)

    class Meta:
        model = QuickSave
        fields = ['id', 'user', 'balance', 'autosave', 'day_interval', 'autosave_amount', 'transactions']


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



class SaveSerializer(Serializer):
    amount = DecimalField(max_digits=10, decimal_places=2)
    password = CharField(max_length=4, min_length=4, write_only=True)

    class Meta:
        fields = ['amount', 'password']


class PasswordSerializer(Serializer):
    password = CharField(max_length=4, min_length=4, write_only=True)

    class Meta:
        fields = ['password']


class TargeSaveTransactionSerializer(ModelSerializer):
    class Meta:
        model = TargetSavingTransaction
        fields = ['id','amount', 'transaction_type', 'timestamp']


class TargetSaveAutoSaveSerializer(ModelSerializer):
    class Meta:
        model = TargetSaveAutoSave
        fields = ['active', 'day_interval', 'autosave_amount']
        read_only_fields = ['active']

    def update(self, instance, validated_data):
        if not instance.active:
            instance.active = True
            instance.day_interval = validated_data['day_interval']
            instance.autosave_amount = validated_data['autosave_amount']
            instance.last_saved = datetime.date(datetime.now())
        else:
            instance.active = False
            instance.day_interval = 0
            instance.autosave_amount = Decimal('0.00')
        instance.save()
        return instance


class TargetSaveSerializer(ModelSerializer):
    user = UserForWallet()
    transactions = TargeSaveTransactionSerializer(many=True)
    autosave = TargetSaveAutoSaveSerializer()

    class Meta:
        model = TargetSave
        fields = ['id', 'user', 'name', 'description', 'targeted_amount', 'progress', 'date_created', 'autosave', 'transactions']


class CreateTargetSaveSerializer(ModelSerializer):
    class Meta:
        model = TargetSave
        fields = ['name', 'description', 'targeted_amount']

    def create(self, validated_data):
        user = self.context['user']
        wallet = user.wallet
        name = validated_data['name']
        description = validated_data['description']
        targeted_amount = validated_data['targeted_amount']

        instance = TargetSave.objects.create(
            user=user,
            wallet=wallet,
            name=name,
            description=description,
            targeted_amount=targeted_amount
        )
        return instance


class MembersForTargetSaveSerializer(ModelSerializer):
    transactions = SerializerMethodField('get_transactions')

    class Meta:
        model = UserModel
        fields = ['id', 'username', 'full_name', 'first_name', 'last_name', 'transactions']

    def get_transactions(self, obj):
        target_save_id = self.context.get('target_save_id')
        queryset = obj.target_saving_transactions.filter(target_save=target_save_id)
        serializer = TargeSaveTransactionSerializer(queryset, many=True)
        return serializer.data


class JointTargetSaveSerializer(ModelSerializer):
    user = UserForWallet()
    members = SerializerMethodField('get_members_serializer')

    class Meta:
        model = TargetSave
        fields = ['id', 'user', 'name', 'description', 'targeted_amount', 'progress', 'date_created', 'members']

    def get_members_serializer(self, obj):
        queryset = obj.members.all()
        serializer = MembersForTargetSaveSerializer(queryset, many=True, context={'target_save_id': obj.id})
        return serializer.data


class CreateJointTargetSaveSerializer(ModelSerializer):
    members = ListField(min_length=1)

    class Meta:
        model = TargetSave
        fields = ['name', 'description', 'targeted_amount', 'members']

    def validate_members(self, members):
        for username in members:
            try:
                UserModel.objects.get(username=username)
            except UserModel.DoesNotExist:
                raise ValidationError(f'user with {username} does not exists')
        return members

    def create(self, validated_data):
        user = self.context['user']
        wallet = user.wallet
        name = validated_data['name']
        description = validated_data['description']
        targeted_amount = validated_data['targeted_amount']
        members = validated_data['members']

        target_save = TargetSave.objects.create(
            user=user,
            wallet=wallet,
            name=name,
            description=description,
            targeted_amount=targeted_amount,
            joint=True
        )
        target_save.members.add(user)
        for username in members:
            member = UserModel.objects.get(username=username)
            target_save.members.add(member)
        target_save.save()
        return target_save

class JointSaveTransactionSerializer(ModelSerializer):
    class Meta:
        model = JointSaveTransaction
        fields = ['id','amount', 'transaction_type', 'timestamp']


class JointSaveMemberSerializer(ModelSerializer):
    transactions = SerializerMethodField('get_transactions')

    class Meta:
        model = UserModel
        fields = ['id', 'username', 'full_name', 'first_name', 'last_name', 'transactions']

    def get_transactions(self, obj):
        joint_save_id = self.context.get('joint_save_id')
        queryset = obj.joint_saving_transactions.filter(joint_save=joint_save_id)
        serializer = JointSaveTransactionSerializer(queryset, many=True)
        return serializer.data


class JointSaveSerializer(ModelSerializer):
    admin = UserForWallet()
    members = SerializerMethodField('get_members_serializer')

    class Meta:
        model = JointSave
        fields = ['id', 'name', 'admin', 'amount', 'total', 'frequency', 'date_created', 'can_invite_member', 'can_disband', 'can_leave', 'members']

    def get_members_serializer(self, obj):
        queryset = obj.members.all()
        serializer = JointSaveMemberSerializer(queryset, many=True, context={'joint_save_id': obj.id})
        return serializer.data


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


class InviteSerializer(Serializer):
    members = ListField(min_length=1)


    class Meta:
        model = JointSave
        fields = ['members']

    def validate_members(self, members):
        for username in members:
            try:
                UserModel.objects.get(username=username)
            except UserModel.DoesNotExist:
                raise ValidationError(f'user with {username} does not exists')
        return members