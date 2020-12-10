from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import WalletSerializer, SetWalletPasswordSerializer, WalletTransferSerializer, ChangeWalletPasswordSerializer
from .models import Wallet, WalletTransaction
from .permissions import ViewOwnWallet
from django.contrib.auth import get_user_model
from user.permissions import EmailVerified, BVNVerified
from user.utils import send_email


UserModel = get_user_model()


class GetWalletView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, ViewOwnWallet]
    authentication_classes = [TokenAuthentication]
    serializer_class = WalletSerializer
    queryset = Wallet.objects.all()
    

class SetPasswordView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = SetWalletPasswordSerializer

    def post(self, request, *args, **kwargs):
        wallet = request.user.wallet
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = ((serializer.validated_data)['password'])
        wallet.set_password(password)
        return Response({'response': 'Your password has been set'}, status=status.HTTP_200_OK)

class ChangePasswordView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = ChangeWalletPasswordSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        if user.wallet.has_password():
            if user.wallet.check_password(((serializer.validated_data)['current_password'])):
                user.wallet.set_password(((serializer.validated_data)['new_password']))
                return Response({'response': 'Your password has been updated'}, status=status.HTTP_200_OK)
            return Response({'error': 'invalid_password'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'You haven\'t set your password'}, status=status.HTTP_400_BAD_REQUEST)

class WalletTransferView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, EmailVerified, BVNVerified]
    authentication_classes = [TokenAuthentication]
    serializer_class = WalletTransferSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        sender = request.user
        amount = ((serializer.validated_data)['amount'])
        beneficiary = UserModel.objects.get(username=((serializer.validated_data)['beneficiary']))
        if not sender.wallet.check_password(((serializer.validated_data)['password'])):
            return Response({'error': 'incorect password'}, status=status.HTTP_400_BAD_REQUEST)
        if sender.wallet.transfer(beneficiary.wallet, amount):
            WalletTransaction.objects.create(
                sender=sender,
                beneficiary=beneficiary,
                amount=amount
            )
            sender_body = f'You sent {amount} to {beneficiary.username}'
            beneficiary_body = f'You just recieved {amount} from {sender.full_name}'
            sender_data = {'body': sender_body, 'subject': 'Wallet debit', 'to': sender.email}
            beneficiary_data = {'body': beneficiary_body, 'subject': 'Wallet Credit', 'to': beneficiary.email}
            send_email(send_email)
            send_email(beneficiary_data)
            return Response({'response': 'Transaction succesful'}, status=status.HTTP_200_OK)
        return Response({'error': 'insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)
        