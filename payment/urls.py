from django.urls import path
from rest_framework import routers
from .views import BanksView, ResovleAccountNumberView, CreateNewAccountView, AccountViewSet, MakePaymentView


router = routers.DefaultRouter()
router.register('accounts', AccountViewSet, 'accounts')


urlpatterns = [
    path('banks', BanksView.as_view()),
    path('account_no/resolve', ResovleAccountNumberView.as_view()),
    path('account/add', CreateNewAccountView.as_view()),
    path('make-payment', MakePaymentView.as_view())
]

urlpatterns += router.urls