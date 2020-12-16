import jwt
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from wallet.models import SavingTransaction
from wallet.utils import WTS, STW, QS, TS, JS
from .serializers import (QuickSaveSerializer, SaveSerializer, TargetSaveSerializer, SetTargetSerializer, 
                            QuickSaveAutoSaveSerializer, TargetSaveAutosaveSerializer, JointSaveSerializer, 
                            CreateJointSaveSerializer, AcceptJointSaveSerializer, SaveToJointSaveSerializer)
from user.tasks import send_email_task
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .permissions import ViewOwnSave, ViewJointSave
from .models import QuickSave, QuicksaveTransaction, TargetSave, TargetSavingTransaction, JointSave, JointSaveTransaction
from .utils import QTW, WTQ, TTW, WTT
from django.contrib.auth import get_user_model
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

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
        save an ammount from person wallet to target save
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
        queryset = user.joint_savings.all()
        return queryset


class JointSaveView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, ViewJointSave]
    authentication_classes = [TokenAuthentication]
    serializer_class = JointSaveSerializer
    queryset = JointSave.objects.all()


class CreateJointSaveView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = CreateJointSaveSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        joint_save = serializer.save()
        members = ((serializer.validated_data)['members'])
        for username in members:
            user = UserModel.objects.get(username=username)
            token = RefreshToken.for_user(user)
            token['joint_saving_id'] = joint_save.id
            current_site = get_current_site(request).domain
            relative_link = reverse('accept-joint-saving')
            absurl = 'http://' + current_site + relative_link + '?token=' + str(token)
            body = f"Hi {user.full_name}, {joint_save.admin.username} invited you to join {joint_save.name} joint save. click this link to join \n {absurl} \n the link will expire in 24hrs"
            email = {'body': body, 'subject': 'Accept joint saving', 'to': [user.email]}
            send_email_task.delay(email)
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
            joint_save = JointSave.objects.get(id=payload['joint_saving_id'])
            if user not in joint_save.members.all():
                joint_save.members.add(user)
                joint_save.save()
            return Response({'response': f'You are now part of {joint_save.name} joint save'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'link expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': 'invaid token'}, status=status.HTTP_400_BAD_REQUEST)


class SaveToJointSaveView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, ViewJointSave]
    authentication_classes = [TokenAuthentication]
    serializer_class = SaveToJointSaveSerializer
    queryset = JointSave.objects.all()

    def put(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = ((serializer.validated_data)['password'])
        wallet = request.user.wallet
        if not wallet.check_password(password):
            return Response(data={'error': 'incorrect password'}, status=status.HTTP_400_BAD_REQUEST)
        joint_save = self.get_object()
        
