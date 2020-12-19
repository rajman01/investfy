import jwt
from decimal import Decimal
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from wallet.models import SavingTransaction
from wallet.utils import WTS, STW, QS, TS, JS
from .serializers import (QuickSaveSerializer, SaveSerializer, TargetSaveSerializer, SetTargetSerializer, 
                            QuickSaveAutoSaveSerializer, TargetSaveAutosaveSerializer, JointSaveSerializer, 
                            CreateJointSaveSerializer, AcceptJointSaveSerializer, PasswordSerializer,
                            InviteSerializer)
from user.tasks import send_email_task
from .permissions import ViewOwnSave, ViewJointSave, AdminJointSave
from .models import QuickSave, QuicksaveTransaction, TargetSave, TargetSavingTransaction, JointSave, JointSaveTransaction, JointSaveTrack
from .utils import QTW, WTQ, TTW, WTT, check_week
from .tasks import send_joint_save_invite, send_disband_email_task
from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from datetime import datetime

UserModel = get_user_model()


class QuickSaveView(generics.RetrieveAPIView):
    serializer_class = QuickSaveSerializer
    permission_classes = [IsAuthenticated, ViewOwnSave]
    authentication_classes = [TokenAuthentication]
    queryset = QuickSave.objects.all()


class WalletCashOutView(generics.GenericAPIView):
    """
        cashes out all the money from quicksave to person wallet
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        quick_save = request.user.quick_save
        amount = quick_save.balance
        if quick_save.cashout():
            QuicksaveTransaction.objects.create(
                user=request.user,
                quicksave=quick_save,
                amount=amount,
                transaction_type=QTW
            )
            SavingTransaction.objects.create(
                user=request.user,
                amount=amount,
                savings_account=QS,
                transaction_type=STW
            )
            return Response(data={'response': 'successfully cashed out'}, status=status.HTTP_200_OK)
        return Response(data={'error': 'No money to cash out'}, status=status.HTTP_400_BAD_REQUEST)


class WalletQuickSaveView(generics.GenericAPIView):
    """
        save an amount from person wallet to quicksave
    """
    serializer_class = SaveSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = ((serializer.validated_data)['amount'])
        password = ((serializer.validated_data)['password'])
        wallet = request.user.wallet
        if not wallet.check_password(password):
            return Response(data={'error': 'incorrect password'}, status=status.HTTP_400_BAD_REQUEST)
        if wallet.save_to_quicksave(amount):
            QuicksaveTransaction.objects.create(
                user=request.user,
                quicksave=wallet.quick_save,
                amount=amount,
                transaction_type=WTQ
            )
            SavingTransaction.objects.create(
                user=request.user,
                amount=amount,
                savings_account=QS,
                transaction_type=WTS
            )
            return Response(data={'response': f'Saved {amount} to investfy with quick save'}, status=status.HTTP_200_OK)
        return Response(data={'error': 'insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)


class TargetSaveView(generics.RetrieveAPIView):
    serializer_class = TargetSaveSerializer
    permission_classes = [IsAuthenticated, ViewOwnSave]
    queryset = TargetSave.objects.all()
    authentication_classes = [TokenAuthentication]


class TargetSaveCashoutView(generics.GenericAPIView):
    """
        Cashes out all the money from targetsave to wallet
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        targetsave = request.user.target_save
        amount = targetsave.progress
        if targetsave.cashout():
            TargetSavingTransaction.objects.create(
                user=request.user,
                target_save=targetsave,
                amount=amount,
                transaction_type= TTW
            )
            SavingTransaction.objects.create(
                user=request.user,
                amount=amount,
                savings_account=TS,
                transaction_type=STW
            )
            return Response(data={'response': 'successfully cashed out'}, status=status.HTTP_200_OK)
        return Response(data={'error': 'You must have saved up to 0.5 of the targeted saving'}, status=status.HTTP_400_BAD_REQUEST)


class WalletTargetSaveView(generics.GenericAPIView):
    """
        save an amount from person wallet to target save
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = SaveSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = ((serializer.validated_data)['amount'])
        password = ((serializer.validated_data)['password'])
        wallet = request.user.wallet
        if not wallet.check_password(password):
            return Response(data={'error': 'incorrect password'}, status=status.HTTP_400_BAD_REQUEST)
        if wallet.can_deduct(amount):
            targetsave = request.user.target_save
            if targetsave.deposit(amount):
                wallet.deduct(amount)
                TargetSavingTransaction.objects.create(
                    user=request.user,
                    target_save=targetsave,
                    amount=amount,
                    transaction_type=WTT
                )
                SavingTransaction.objects.create(
                    user=request.user,
                    amount=amount,
                    savings_account=TS,
                    transaction_type=WTS
                )
                return Response(data={'response': f'Saved {amount} to investfy with target save'}, status=status.HTTP_200_OK)     
            return Response(data={'error': 'set target before saving'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data={'error': 'insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)


class SetTargetView(generics.GenericAPIView):
    """
        set target for target saving
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = SetTargetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = ((serializer.validated_data)['amount'])
        targetsave = request.user.target_save
        if targetsave.set_target(amount):
            return Response(data={'response': 'target has been set'}, status=status.HTTP_200_OK)
        return Response(data={'error': 'new target must be higher than old target'}, status=status.HTTP_400_BAD_REQUEST)


class QuickSaveAutoSaveView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = QuickSaveAutoSaveSerializer

    def put(self, request, *args, **kwargs):
        quicksave = request.user.quick_save
        serializer = self.serializer_class(instance=quicksave, data=request.data)
        serializer.is_valid(raise_exception=True)
        quicksave = serializer.save()
        if quicksave.autosave:
            data = {'response' : 'activated quicksave autosave'}
        else:
            data = {'response' : 'de-activated quicksave autosave'}
        return Response(data=data, status=status.HTTP_200_OK)


class TargetSaveAutoSaveView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = TargetSaveSerializer

    def put(self, request, *args, **kwargs):
        targetsave = request.user.target_save
        serializer = self.serializer_class(instance=targetsave, data=request.data)
        serializer.is_valid(raise_exception=True)
        targetsave = serializer.save()
        if targetsave.autosave:
            data = {'response' : 'activated targetsave autosave'}
        else:
            data = {'response' : 'de-activated target autosave'}
        return Response(data=data, status=status.HTTP_200_OK)


class JointSavingsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = JointSaveSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = user.joint_savings.filter(is_active=True)
        return queryset


class JointSaveView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, ViewJointSave]
    authentication_classes = [TokenAuthentication]
    serializer_class = JointSaveSerializer
    queryset = JointSave.objects.filter(is_active=True)


class CreateJointSaveView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = CreateJointSaveSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        joint_save = serializer.save()
        JointSaveTrack.objects.create(
            joint_save=joint_save,
            user=request.user
        )
        members = ((serializer.validated_data)['members'])
        current_site = get_current_site(request).domain
        send_joint_save_invite.delay(members, joint_save.id, current_site)
        data = JointSaveSerializer(instance=joint_save)
        return Response(data=data.data, status=status.HTTP_200_OK)


class AcceptJointSaveView(generics.GenericAPIView):
    serializer_class = AcceptJointSaveSerializer

    token_param_config = openapi.Parameter(
        'token', in_=openapi.IN_QUERY, description='Description', type=openapi.TYPE_STRING)

    @swagger_auto_schema(manual_parameters=[token_param_config])

    def get(self, request, *args, **kwargs):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
            user = UserModel.objects.get(id=payload['user_id'])
            joint_save = JointSave.objects.get(id=payload['joint_save_id'])
            if user not in joint_save.members.all():
                joint_save.members.add(user)
                joint_save.save()
                JointSaveTrack.objects.create(
                    joint_save=joint_save,
                    user=user
                )
            return Response({'response': f'You are now part of {joint_save.name} joint save'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'link expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': 'invaid token'}, status=status.HTTP_400_BAD_REQUEST)


class SaveToJointSaveView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, ViewJointSave]
    authentication_classes = [TokenAuthentication]
    serializer_class = PasswordSerializer
    queryset = JointSave.objects.filter(is_active=True)

    def put(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = ((serializer.validated_data)['password'])
        wallet = request.user.wallet
        if not wallet.check_password(password):
            return Response(data={'error': 'incorrect password'}, status=status.HTTP_400_BAD_REQUEST)
        joint_save = self.get_object()
        amount = joint_save.amount
        if not wallet.can_deduct(amount):
            return Response(data={'error': 'insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)
        latest_transaction = JointSaveTransaction.objects.filter(user=request.user, joint_save=joint_save)
        if not latest_transaction.exists():
            wallet.deduct(amount)
            joint_save.contribute()
            JointSaveTransaction.objects.create(
                joint_save=joint_save,
                user=request.user,
                amount=amount
            )
            SavingTransaction.objects.create(
                user=request.user,
                amount=amount,
                savings_account=JS,
                transaction_type=WTS
            )
            return Response(data={'response': f'Made {joint_save.frequency} contribution to {joint_save.name}'}, status=status.HTTP_200_OK)
        else:       
            transaction = latest_transaction.last()
            if check_week(datetime.date(transaction.timestamp), joint_save.date_created) != check_week(datetime.date(datetime.now()), joint_save.date_created):
                wallet.deduct(amount)
                joint_save.contribute()
                JointSaveTransaction.objects.create(
                    joint_save=joint_save,
                    user=request.user,
                    amount=amount
                )
                SavingTransaction.objects.create(
                    user=request.user,
                    amount=amount,
                    savings_account=JS,
                    transaction_type=WTS
                )
                return Response(data={'response': f'Made {joint_save.frequency} contribution to {joint_save.name}'}, status=status.HTTP_200_OK)
            else: 
                return Response(data={'error': f'You\'ve made {joint_save.frequency} contribution to {joint_save.name} already'}, status=status.HTTP_400_BAD_REQUEST )

        

class InviteToJointSaveView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, AdminJointSave]
    authentication_classes = [TokenAuthentication]
    serializer_class = InviteSerializer
    queryset = JointSave.objects.filter(is_active=True)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        joint_save = self.get_object()
        if joint_save.can_invite_member():
            members = ((serializer.validated_data)['members'])
            current_site = get_current_site(request).domain
            send_joint_save_invite.delay(members, joint_save.id, current_site)
            return Response(data={'response': 'invitation sent to users'}, status=status.HTTP_200_OK)
        return Response(data={'error': f'cant invite member {joint_save.name}'}, status=status.HTTP_400_BAD_REQUEST)


class DisbandJointSaveView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, AdminJointSave]
    authentication_classes = [TokenAuthentication]
    serializer_class = PasswordSerializer
    queryset = JointSave.objects.filter(is_active=True)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = ((serializer.validated_data)['password'])
        wallet = request.user.wallet
        if not wallet.check_password(password):
            return Response(data={'error': 'incorrect password'}, status=status.HTTP_400_BAD_REQUEST)
        joint_save = self.get_object()
        if joint_save.can_disband():
            for transaction in JointSaveTransaction.objects.filter(joint_save=joint_save):
                wallet = transaction.user.wallet
                wallet.balance += transaction.amount
                joint_save.total -= transaction.amount
                wallet.save()
                SavingTransaction.objects.create(
                    user=transaction.user,
                    amount=transaction.amount,
                    savings_account=JS,
                    transaction_type=STW
                )
            joint_save.save()
            name = joint_save.name
            emails = [member.email for member in joint_save.members.all()]
            send_disband_email_task.delay(name, emails)
            joint_save.delete()
            return Response(data={'response': f'{name} as been disbaned'}, status=status.HTTP_200_OK)
        return Response(data={'response': 'sorry, you cant disband this joint save'}, status=status.HTTP_400_BAD_REQUEST)
        

class LeaveJointSave(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, ViewJointSave]
    authentication_classes = [TokenAuthentication]
    queryset = JointSave.objects.filter(is_active=True)

    def get(self, request, *args, **kwargs):
        joint_save = self.get_object()
        if joint_save.can_leave():
            amount = Decimal('0.00')
            wallet = request.user.wallet
            for transaction in JointSaveTransaction.objects.filter(joint_save=joint_save, user=request.user):
                wallet.balance += transaction.amount
                joint_save.total -= transaction.amount
                amount += transaction.amount
            wallet.save()
            if amount:
                SavingTransaction.objects.create(
                    user=transaction.user,
                    amount=amount,
                    savings_account=JS,
                    transaction_type=STW
                )
            joint_save.members.remove(request.user)
            if joint_save.admin == request.user:
                joint_save.admin = None
            joint_save.save()
            joint_save_track = JointSaveTrack.objects.filter(user=request.user, joint_save=joint_save).first()
            joint_save_track.delete()
            return Response(data={'response': f'You left {joint_save.name} joint save'}, status=status.HTTP_200_OK)
        return Response(data={'error': f'Sorry, You can\'t leave {joint_save.name} joint save'}, status=status.HTTP_400_BAD_REQUEST)