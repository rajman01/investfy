from django.urls import path
from .views import InvestmentsView, InvestmentforInvestorsView, InvestmentView, CreateInvestmentView, InvestView, ApproveInvestmentView

urlpatterns = [
    path('all', InvestmentsView.as_view()),
    path('', InvestmentforInvestorsView.as_view()),
    path('<int:pk>', InvestmentView.as_view()),
    path('add', CreateInvestmentView.as_view()),
    path('invest', InvestmentsView.as_view()),
    path('approve', ApproveInvestmentView.as_view())



]