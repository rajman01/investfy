from django.shortcuts import render
from rest_framework import generics, filters, status, mixins, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Bank
from .serializers import BankSerializer, AcountDetailsSerializer, CreateAccountSerializer, AccountSerializer, MakePaymentSerializer
from .utils import resolve_account
from .permissions import ViewOwnAccount
from wallet.models import AccountTransaction
from wallet.serializers import AccountTransactionSerializer

class BanksView(generics.ListAPIView):
    serializer_class = BankSerializer
    queryset = Bank.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class ResovleAccountNumberView(generics.GenericAPIView):
    serializer_class = AcountDetailsSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        acct_no = ((serializer.validated_data)['acct_no'])
        bank_code = ((serializer.validated_data)['bank_code'])
        result = resolve_account(acct_no, bank_code)
        if result.get('status_code') == 200:
            return Response(data={'response': result['data'].get('data')}, status=status.HTTP_200_OK)
        else:
            return Response(data={'error': result['data'].get('message')}, status=status.HTTP_400_BAD_REQUEST)


class CreateNewAccountView(generics.CreateAPIView):
    serializer_class = CreateAccountSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        acct_no = ((serializer.validated_data)['number'])
        bank_code = ((serializer.validated_data)['bank_code'])
        name = ((serializer.validated_data)['name'])
        result = resolve_account(acct_no, bank_code)
        if result.get('status_code') != 200:
            return Response(data={'error': result['data'].get('message')}, status=status.HTTP_400_BAD_REQUEST)
        verified_name = result['data'].get('data')['account_name']
        if verified_name.lower().strip() != name.lower().strip():
            return Response(data={'error': 'account number deos not match with the name given'}, status=status.HTTP_400_BAD_REQUEST)
        account = serializer.save()
        serializer_data = AccountSerializer(instance=account)
        return Response(data=serializer_data.data, status=status.HTTP_200_OK)
    

class AccountViewSet(mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer

    def get_queryset(self):
        user = self.request.user
        return user.accounts.all()

# temporary
class MakePaymentView(generics.GenericAPIView):
    serializer_class = MakePaymentSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.wallet.check_password(((serializer.validated_data)['password'])):
            return Response({'error': 'incorect password'}, status=status.HTTP_400_BAD_REQUEST)
        amount = ((serializer.validated_data)['amount'])
        if user.wallet.can_deduct(amount):
            acct_no = ((serializer.validated_data)['acct_no'])
            bank_code = ((serializer.validated_data)['bank_code'])
            name = ((serializer.validated_data)['name'])
            result = resolve_account(acct_no, bank_code)
            if result.get('status_code') != 200:
                return Response(data={'error': result['data'].get('message')}, status=status.HTTP_400_BAD_REQUEST)
            verified_name = result['data'].get('data')['account_name']
            if verified_name.lower().strip() != name.lower().strip():
                return Response(data={'error': 'account number deos not match with the name given'}, status=status.HTTP_400_BAD_REQUEST)
            user.wallet.deduct(amount)
            transaction = AccountTransaction.objects.create(
                user=user,
                amount=amount,
                acct_no=result['data'].get('data')['account_number'],
                name=result['data'].get('data')['account_name'],
                successful=True
            )
            transaction_serializer = AccountTransactionSerializer(instance=transaction)
            return Response(data={'response': 'Successfully made payment', 'transaction': transaction_serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': 'Insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)

        