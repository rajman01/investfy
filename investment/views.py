from rest_framework import generics, status
from rest_framework.response import Response
from .models import Investment, InvesmentTransaction
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import InvestmentSerializer, InvestmentForOwner, InvestmentForInvestors, CreateInvestorSerializer, InvestSerializer
from user.permissions import EmailVerified

class InvestmentsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvestmentSerializer
    queryset = Investment.objects.filter(active=True, approved=True)


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
    permission_classes = [IsAuthenticated, EmailVerified]
    serializer_class = CreateInvestorSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(data=request.data, context={'owner': user})
        serializer.is_valid(raise_exception=True)
        investment = serializer.save()
        return Response(data={'response': 'Your investment has been created, we will get back to you soon'}, status=status.HTTP_200_OK)


class InvestView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, EmailVerified]
    serializer_class = InvestmentView
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
                    InvesmentTransaction.object.create(
                        user=user,
                        investment=investment,
                        amount=amount,
                        units_bought=units
                    )
                    return Response({'response': 'invested successfully'}, status=status.HTTP_200_OK)
                return Response({'error': 'not enough units'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': 'this investment is sold out'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)


class ApproveInvestmentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Investment.objects.all()

    def get(self, request, *args, **kwargs):
        investment = self.get_object()
        investment.approved = True
        investment.active = True
        investment.save()
        return Response({'response': 'approved'}, status=status.HTTP_200_OK)