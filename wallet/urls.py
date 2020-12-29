from django.urls import path
from . import views


urlpatterns = [
    path('', views.GetWalletView.as_view()),
    path('set', views.SetPasswordView.as_view()),
    path('transfer', views.WalletTransferView.as_view()),
    path('password/change', views.ChangePasswordView.as_view()),
    path('wallet_id/change', views.ChangeWalletIDView.as_view()),
    path('fund', views.FundWalletView.as_view())
    
]