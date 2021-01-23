from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import WalletSerializer, SetWalletPasswordSerializer, WalletTransferSerializer, ChangeWalletPasswordSerializer, ChangeWalletIDSerializer, FundWalletSerializer, WalletTransactionSerializer
from .models import Wallet, WalletTransaction
from .permissions import ViewOwnWallet
from django.contrib.auth import get_user_model
from user.permissions import EmailVerified, BVNVerified
from user.tasks import send_email_task


UserModel = get_user_model()


class GetWalletView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WalletSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=request.user.wallet)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    

class SetPasswordView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SetWalletPasswordSerializer

    def post(self, request, *args, **kwargs):
        wallet = request.user.wallet
        serializer = self.serializer_class(instance=wallet, data=request.data)
        serializer.is_valid(raise_exception=True)
        password = ((serializer.validated_data)['password'])
        wallet_id = ((serializer.validated_data)['wallet_id'])
        if not wallet.has_password():
            wallet.set_password(password, wallet_id)
            return Response({'response': 'Your password has been set'}, status=status.HTTP_200_OK)
        return Response({'error': 'You can\'t set wallet more than once'}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangeWalletPasswordSerializer

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        if user.wallet.check_password(((serializer.validated_data)['current_password'])):
            user.wallet.set_password(((serializer.validated_data)['new_password']), user.wallet.wallet_id)
            return Response({'response': 'Your password has been updated'}, status=status.HTTP_200_OK)
        return Response({'error': 'invalid_password'}, status=status.HTTP_400_BAD_REQUEST)

class WalletTransferView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, EmailVerified, BVNVerified]
    serializer_class = WalletTransferSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        sender = request.user
        if not sender.wallet.check_password(((serializer.validated_data)['password'])):
            return Response({'error': 'incorect password'}, status=status.HTTP_400_BAD_REQUEST)
        amount = ((serializer.validated_data)['amount'])
        beneficiary_wallet = Wallet.objects.get(wallet_id=((serializer.validated_data)['wallet_id']))
        beneficiary = UserModel.objects.get(wallet=beneficiary_wallet)
        if sender.wallet.transfer(beneficiary_wallet, amount):
            transaction = WalletTransaction.objects.create(
                sender=sender,
                beneficiary=beneficiary,
                amount=amount
            )
            sender_body = f'You sent {amount} to {beneficiary.username}'
            beneficiary_body = f'You just recieved {amount} from {sender.full_name}'
            sender_data = {'body': sender_body, 'subject': 'Wallet debit', 'to': [sender.email]}
            beneficiary_data = {'body': beneficiary_body, 'subject': 'Wallet Credit', 'to': [beneficiary.email]}
            send_email_task.delay(sender_data)
            send_email_task.delay(beneficiary_data)
            transaction_serializer = WalletTransactionSerializer(instance=transaction)
            return Response({'response': 'Transaction succesful', 'transaction': transaction_serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': 'insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)


class ChangeWalletIDView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangeWalletIDSerializer

    def put(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=request.user.wallet, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data={'response': 'You wallet id has been updated'}, status=status.HTTP_200_OK)

# temporary
class FundWalletView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, EmailVerified]
    serializer_class = FundWalletSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = ((serializer.validated_data)['amount'])
        wallet = self.request.user.wallet
        wallet.balance += amount
        wallet.save()
        transaction = WalletTransaction.objects.create(
            beneficiary=request.user,
            amount=amount
        )
        transaction = WalletTransactionSerializer(instance=transaction)
        return Response(data={'response': f'You have funded Your wallet with {amount} naira', 'transaction': transaction.data}, status=status.HTTP_200_OK)
        