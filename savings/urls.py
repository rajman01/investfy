from django.urls import path
from .views import (QuickSaveView, WalletCashOutView, WalletQuickSaveView,
                     TargetSaveView, TargetSaveCashoutView, WalletTargetSaveView, SetTargetView)


urlpatterns = [
    path('quicksave/<int:pk>', QuickSaveView.as_view()),
    path('quicksave/cashout', WalletCashOutView.as_view()),
    path('quicksave/save', WalletQuickSaveView.as_view()),
    path('targetsave/<int:pk>', TargetSaveView.as_view()),
    path('targetsave/cashout', TargetSaveCashoutView.as_view()),
    path('targetsave/save', WalletTargetSaveView.as_view()),
    path('targetsave/set', SetTargetView.as_view())
]