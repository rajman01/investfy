from django.urls import path
from .views import InvestmentsView, InvestmentforInvestorsView, InvestmentView, CreateInvestmentView, InvestView, ApproveInvestmentView, CashOutInvestmentMoney

urlpatterns = [
    path('all', InvestmentsView.as_view()),
    path('', InvestmentforInvestorsView.as_view()),
    path('<int:pk>', InvestmentView.as_view()),
    path('add', CreateInvestmentView.as_view()),
    path('invest/<int:pk>', InvestView.as_view()),
    path('approve', ApproveInvestmentView.as_view()),
    path('cashout/<int:pk>', CashOutInvestmentMoney.as_view())

]