from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from investfy.wallet.models import SavingTransaction
from investfy.wallet.utils import WTS, STW, QS, TS, JS
from .serializers import QuickSaveSerializer, SaveSerializer, TargetSaveSerializer, SetTargetSerializer
from .permissions import ViewOwnSave
from .models import QuickSave, QuicksaveTransaction, TargetSave, TargetSavingTransaction
from .utils import QTW, WTQ, TTW, WTT


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
        if wallet.deduct(amount):
            targetsave = request.user.target_save
            if targetsave.deposit(amount):
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
            return Response(data={'error': 'set target befor saving'}, status=status.HTTP_400_BAD_REQUEST)
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