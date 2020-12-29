import jwt
from decimal import Decimal
from rest_framework import generics, status, views, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from wallet.models import SavingTransaction
from wallet.utils import WTS, STW, QS, TS, JS
from .serializers import (QuickSaveSerializer, SaveSerializer, TargetSaveSerializer, CreateTargetSaveSerializer,
                            QuickSaveAutoSaveSerializer, TargetSaveAutoSaveSerializer, JointTargetSaveSerializer,
                             JointSaveSerializer, CreateJointTargetSaveSerializer,
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


class QuickSaveView(generics.GenericAPIView):
    serializer_class = QuickSaveSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=request.user.quick_save)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class QuickSaveCashOutView(generics.GenericAPIView):
    """
        cashes out all the money from quicksave to person wallet
    """
    permission_classes = [IsAuthenticated]

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


class QuickSaveDepositView(generics.GenericAPIView):
    """
        save an amount from person wallet to quicksave
    """
    serializer_class = SaveSerializer
    permission_classes = [IsAuthenticated]

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


class QuickSaveAutoSaveView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
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


class TargetSaveView(generics.RetrieveAPIView):
    serializer_class = TargetSaveSerializer
    permission_classes = [IsAuthenticated, ViewOwnSave]
    queryset = TargetSave.objects.filter(joint=False)


class TargetSavingsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TargetSaveSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        user = self.request.user
        queryset = user.target_savings.filter(joint=False)
        return queryset


class CreateTargetSaveView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateTargetSaveSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        target_save = serializer.save()
        data = TargetSaveSerializer(instance=target_save)
        return Response(data=data.data, status=status.HTTP_201_CREATED)


class TargetSaveCashoutView(generics.GenericAPIView):
    """
        Cashes out all the money from targetsave to wallet
    """
    permission_classes = [IsAuthenticated, ViewOwnSave]
    queryset = TargetSave.objects.filter(joint=False)

    def get(self, request, *args, **kwargs):
        targetsave = self.get_object()
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


class TargetSaveDepositView(generics.GenericAPIView):
    """
        save an amount from person wallet to target save
    """
    permission_classes = [IsAuthenticated, ViewOwnSave]
    serializer_class = SaveSerializer
    queryset = TargetSave.objects.filter(joint=False)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = ((serializer.validated_data)['amount'])
        password = ((serializer.validated_data)['password'])
        wallet = request.user.wallet
        if not wallet.check_password(password):
            return Response(data={'error': 'incorrect password'}, status=status.HTTP_400_BAD_REQUEST)
        if wallet.can_deduct(amount):
            targetsave = self.get_object()
            targetsave.deposit(amount)
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
        return Response(data={'error': 'insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)


class TargetSaveDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, ViewOwnSave]
    queryset = TargetSave.objects.filter(joint=False)

    def delete(self, request, *args, **kwargs):
        target_save = self.get_object()
        if target_save.can_delete():
            amount = target_save.progress
            wallet = request.user.wallet
            wallet.balance += target_save.progress
            target_save.progress = Decimal('0.00')
            wallet.save()
            target_save.save()
            SavingTransaction.objects.create(
                user=request.user,
                amount=amount,
                savings_account=TS,
                transaction_type=STW
            )
            target_save.delete()
            return Response(data={'response': 'deleted successfully'}, status=status.HTTP_200_OK)
        return Response(data={'error': 'Sorry, can\'t delete this target save'})
            


class TargetSaveAutoSaveView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, ViewOwnSave]
    serializer_class = TargetSaveAutoSaveSerializer
    queryset = TargetSave.objects.filter(joint=False)

    def put(self, request, *args, **kwargs):
        targetsave = self.get_object()
        serializer = self.serializer_class(instance=targetsave.autosave, data=request.data)
        serializer.is_valid(raise_exception=True)
        autosave = serializer.save()
        if autosave.active:
            data = {'response' : 'activated targetsave autosave'}
        else:
            data = {'response' : 'de-activated target autosave'}
        return Response(data=data, status=status.HTTP_200_OK)


class JointTargetSavingsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JointTargetSaveSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        user = self.request.user
        queryset = user.joint_target_savings.all()
        return queryset


class JointTargetSaveView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, ViewJointSave]
    serializer_class = JointTargetSaveSerializer
    queryset = TargetSave.objects.filter(joint=True)


class CreateJointTargetSaveView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateJointTargetSaveSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        target_save = serializer.save()
        body = f'You have been added to {target_save.user.username} joint target save'
        emails = [member.email for member in target_save.members.all().exclude(pk=request.user.pk)]
        send_email_task.delay({'body': body, 'subject': 'Joint Target Saving', 'to': emails})
        data = JointTargetSaveSerializer(instance=target_save)
        return Response(data=data.data, status=status.HTTP_201_CREATED)


class JointTargetSaveCashOut(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, ViewOwnSave]
    queryset = TargetSave.objects.filter(joint=True)

    def get(self, request, *args, **kwargs):
        targetsave = self.get_object()
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

        
class JointTargetSaveDepositView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, ViewJointSave]
    serializer_class = SaveSerializer
    queryset = TargetSave.objects.filter(joint=True)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = ((serializer.validated_data)['amount'])
        password = ((serializer.validated_data)['password'])
        wallet = request.user.wallet
        if not wallet.check_password(password):
            return Response(data={'error': 'incorrect password'}, status=status.HTTP_400_BAD_REQUEST)
        if wallet.can_deduct(amount):
            targetsave = self.get_object()
            targetsave.deposit(amount)
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
        return Response(data={'error': 'insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)


class JointTargetSaveDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, ViewOwnSave]
    queryset = TargetSave.objects.filter(joint=True)

    def delete(self, request, *args, **kwargs):
        target_save = self.get_object()
        if target_save.can_delete():
            for transaction in target_save.transactions.all():
                wallet = transaction.user.wallet
                wallet.balance += transaction.amount
                target_save.progress -= transaction.amount
                wallet.save()
                SavingTransaction.objects.create(
                    user=transaction.user,
                    amount=transaction.amount,
                    savings_account=TS,
                    transaction_type=STW
                )
            target_save.save()
            target_save.delete()
            return Response(data={'response': 'successfuly deleted'}, status=status.HTTP_200_OK)
        return Response(data={'error': 'Sorry can\'t delete this joint target save'})


class JointTargetSaveInviteView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, ViewOwnSave]
    queryset = TargetSave.objects.filter(joint=True)
    serializer_class = InviteSerializer

    def put(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        members =  ((serializer.validated_data)['members'])
        target_save = self.get_object()
        for username in members:
            member = UserModel.objects.get(username=username)
            if member not in target_save.members.all():
                target_save.members.add(member)
        target_save.save()
        return Response(data={'response': 'successfullt added new members'}, status=status.HTTP_200_OK)

class JointTargetSaveLeaveView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, ViewJointSave]
    queryset = TargetSave.objects.filter(joint=True)

    def get(self, request, *args, **kwargs):
        target_save = self.get_object()
        for transaction in TargetSavingTransaction.objects.filter(target_save=target_save, user=request.user):
            transaction.delete()
        if request.user == target_save.user and target_save.members.exists():
            target_save.user = target_save.members.first()
        target_save.save()
        return Response(data={'response': 'You left this joint target save'}, status=status.HTTP_200_OK)
        

class JointSavingsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JointSaveSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        user = self.request.user
        queryset = user.joint_savings.filter(is_active=True)
        return queryset


class JointSaveView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, ViewJointSave]
    serializer_class = JointSaveSerializer
    queryset = JointSave.objects.filter(is_active=True)


class CreateJointSaveView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
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


class DisbandJointSaveView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, AdminJointSave]
    queryset = JointSave.objects.filter(is_active=True)

    def delete(self, request, *args, **kwargs):
        joint_save = self.get_object()
        if joint_save.can_disband():
            for transaction in JointSaveTransaction.objects.filter(joint_save=joint_save):
                member_wallet = transaction.user.wallet
                member_wallet.balance += transaction.amount
                joint_save.total -= transaction.amount
                member_wallet.save()
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
                transaction.delete()
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


class JointSaveReactivateView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
            joint_save = JointSave.objects.get(id=payload['joint_save_id'])
            joint_save.is_active = True
            joint_save.date_created = datetime.date(datetime.now())
            joint_save.save()
            return Response({'response': f'Re activated {joint_save.name} joint save'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'link expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': 'invaid token'}, status=status.HTTP_400_BAD_REQUEST)