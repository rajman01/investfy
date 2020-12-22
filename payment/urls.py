from django.urls import path
from .views import BanksView, ResovleAccountNumberView, CreateNewAccountView, AccountsView, DeleteAccountView, AccountView


urlpatterns = [
    path('banks', BanksView.as_view()),
    path('account_no/resolve', ResovleAccountNumberView.as_view()),
    path('account/add', CreateNewAccountView.as_view()),
    path('accounts', AccountsView.as_view()),
    path('account/delete/<int:pk>', DeleteAccountView.as_view()),
    path('account/<int:pk>', AccountView.as_view()),
]