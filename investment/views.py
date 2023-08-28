from rest_framework import generics, status, filters
from rest_framework.response import Response
from .models import Investment, InvesmentTransaction
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import InvestmentSerializer, InvestmentForOwner, InvestmentForInvestors, CreateInvestorSerializer, InvestSerializer, InvesmentTransactionSerializer
from user.permissions import EmailVerified, BVNVerified
from datetime import datetime
from .permissions import ViewOwnInvestment
from savings.serializers import PasswordSerializer
from wallet.models import WalletTransaction
from decimal import Decimal
from wallet.serializers import WalletTransactionSerializer


class InvestmentsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvestmentSerializer
    queryset = Investment.objects.filter(active=True, approved=True)
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class InvestmentforInvestorsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvestmentSerializer
    
    def get_queryset(self):
        return self.request.user.investments.all()

class InvestmentView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Investment.objects.filter(active=True, approved=True)

    def get(self, request, *args, **kwargs):
        investment = self.get_object()
        user = request.user
        if user == investment.owner:
            serializer =  InvestmentForOwner(instance=investment)
        elif user in investment.investors.all():
            serializer =  InvestmentForInvestors(instance=investment, context={'investor': user})
        else:
            serializer =  InvestmentSerializer(instance=investment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateInvestmentView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, EmailVerified, BVNVerified]
    serializer_class = CreateInvestorSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(data=request.data, context={'owner': user})
        serializer.is_valid(raise_exception=True)
        investment = serializer.save()
        return Response(data={'response': 'Your investment has been created, we will get back to you soon'}, status=status.HTTP_200_OK)


class InvestView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, EmailVerified, BVNVerified]
    serializer_class = InvestSerializer
    queryset = Investment.objects.filter(active=True, approved=True)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        units = ((serializer.validated_data)['units'])
        user =  request.user
        if not user.wallet.check_password(((serializer.validated_data)['password'])):
            return Response({'error': 'invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        investment = self.get_object()
        amount = units * investment.amount_per_unit
        if user.wallet.can_deduct(amount):
            if not investment.sold_out():
                if investment.invest(units, user):
                    user.wallet.deduct(amount)
                    transaction = InvesmentTransaction.objects.create(
                        user=user,
                        investment=investment,
                        amount=amount,
                        units_bought=units
                    )
                    transaction_serializer = InvesmentTransactionSerializer(instance=transaction)
                    return Response({'response': 'invested successfully', 'transaction': transaction_serializer.data}, status=status.HTTP_200_OK)
                return Response({'error': 'not enough units'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': 'this investment is sold out'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)


class CashOutInvestmentMoney(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, ViewOwnInvestment, EmailVerified, BVNVerified]
    serializer_class = PasswordSerializer

    def get_queryset(self):
        return self.request.user.my_investments.filter(active=True, approved=True)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user =  request.user
        if not user.wallet.check_password(((serializer.validated_data)['password'])):
            return Response({'error': 'invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        investment = self.get_object()
        if investment.total_amount > Decimal('0.00'):
            user.wallet.balance += investment.total_amount
            user.wallet.save()
            amount = str(investment.total_amount)
            transaction = WalletTransaction.objects.create(
                beneficiary=request.user,
                amount=investment.total_amount
            )
            investment.total_amount = Decimal('0.00')
            investment.save()
            transaction_serializer = WalletTransactionSerializer(instance=transaction)
            return Response(data={'response': f'{amount} naira has been transfered to your wallet', 'transaction': transaction_serializer.data}, status=status.HTTP_200_OK)
        return Response(data={'error': 'No money in this investment'}, status=status.HTTP_400_BAD_REQUEST)


class ApproveInvestmentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Investment.objects.all()

    def get(self, request, *args, **kwargs):
        investment = self.get_object()
        investment.approved = True
        investment.active = True
        investment.date_approved = datetime.date(datetime.now())
        investment.save()
        return Response({'response': 'approved'}, status=status.HTTP_200_OK)