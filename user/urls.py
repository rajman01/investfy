from django.urls import path
from . import views

urlpatterns = [
    path('register', views.RegisterView.as_view()),
    path('login', views.LoginView.as_view()),
    path('email/verification', views.sendEmailVerificationView.as_view()),
    path('verify-email', views.VerifyEmailView.as_view(), name='verify-email'),
    path('password/change', views.ChangePasswordView.as_view()),
    path('email/change', views.ChangeEmailView.as_view()),
    path('user/<int:pk>', views.UserDetailView.as_view()),
    path('bvn/verification', views.VerifyBVNView.as_view())
]