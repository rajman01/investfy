from django.urls import path
from . import views


urlpatterns = [
    path('<int:pk>', views.GetWalletView.as_view()),
    path('password/set', views.SetPasswordView.as_view()),
    path('transfer', views.WalletTransferView.as_view()),
    path('password/change', views.ChangePasswordView.as_view()),
    
]