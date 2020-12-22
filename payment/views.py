from django.shortcuts import render
from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Bank
from .serializers import BankSerializer, AcountDetailsSerializer, CreateAccountSerializer, AccountSerializer
from .utils import resolve_account
from .permissions import ViewOwnAccount

class BanksView(generics.ListAPIView):
    serializer_class = BankSerializer
    queryset = Bank.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class ResovleAccountNumberView(generics.GenericAPIView):
    serializer_class = AcountDetailsSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

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
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        acct_no = ((serializer.validated_data)['number'])
        bank_code = ((serializer.validated_data)['bank_code'])
        name = ((serializer.validated_data)['name'])
        result = resolve_account(acct_no, bank_code)
        if result.get('status_code') != 200:
            return Response(data={'error': result['data'].get('message')}, status=status.HTTP_400_BAD_REQUEST)
        verified_name = result['data'].get('data')['account_name']
        if verified_name.lower() != name.lower():
            return Response(data={'error': 'account number deos not match with the name given'}, status=status.HTTP_400_BAD_REQUEST)
        account = serializer.save()
        serializer_data = AccountSerializer(instance=account)
        return Response(data=serializer_data.data, status=status.HTTP_200_OK)


class AccountView(generics.RetrieveAPIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated, ViewOwnAccount]
    authentication_classes = [TokenAuthentication]

    

class AccountsView(generics.ListAPIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        return user.accounts.all()


class DeleteAccountView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        return user.accounts.all()

