import jwt
from decouple import config
from .serializers import (RegisterSerializer, UserSerializer, LoginSerializer, EmailVerificationSerializer, 
                            ChangePasswordSerializer, ChangeEmailSerializer, VerifyBVNSerializer)
from .permissions import UpdateOwnProfile
from wallet.serializers import UserForWallet
from rest_framework import generics, status, views, filters
from rest_framework.response import Response
from .utils import send_email, get_bvn_details
from .tasks import send_email_task
from django.contrib.sites.shortcuts import get_current_site
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from django.conf import settings
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from knox.models import AuthToken
from knox.auth import TokenAuthentication


UserModel = get_user_model()
GLOBAL_CURRENT_SITE = ''

class RegisterView(generics.CreateAPIView):
    """
    Registers a new user and returns user details if succesfull
    """
    serializer_class = RegisterSerializer
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        GLOBAL_CURRENT_SITE = get_current_site(request).domain
        seriaizer = self.serializer_class(data=request.data)
        if seriaizer.is_valid():
            user = seriaizer.save()
            user_serializer = UserSerializer(instance=user)
            return Response(data={"user": user_serializer.data, "token": AuthToken.objects.create(user)[1]}, status=status.HTTP_200_OK)
        return Response(seriaizer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.GenericAPIView):
    """
    logs in a user and returns its details
    """
    serializer_class = LoginSerializer
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        user_serializer = UserSerializer(instance=user)
        return Response(data={"user": user_serializer.data, "token": AuthToken.objects.create(user)[1]}, status=status.HTTP_200_OK)


class sendEmailVerificationView(views.APIView):
    """
    sends a verification mail to user with unverified email
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.email_verified:
            return Response({'response': 'The email for this account has been verified'}, status=status.HTTP_200_OK)
        token = RefreshToken.for_user(user).access_token
        current_site = get_current_site(request).domain
        relative_link = reverse('verify-email')
        absurl = 'http://' + current_site + relative_link + '?token=' + str(token)
        body = f"Hi {user.full_name}, use the link below to verify your email \n {absurl}"
        data = {'body': body, 'subject': 'Verify your email', 'to': [user.email]}
        send_email_task.delay(data)
        return Response({'response': 'A mail has been sent to verify your email'}, status=status.HTTP_200_OK)


class VerifyEmailView(views.APIView):
    """
    verifies email by encrypted token
    """
    serializer_class = EmailVerificationSerializer

    # adding a token field to the swagger ui
    token_param_config = openapi.Parameter(
        'token', in_=openapi.IN_QUERY, description='Description', type=openapi.TYPE_STRING)

    @swagger_auto_schema(manual_parameters=[token_param_config])
    
    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
            user = UserModel.objects.get(id=payload['user_id'])
            user.email_verified = True
            user.save()
            return Response({'response': 'your email has been verified'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Activation link expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': 'invaid token'}, status=status.HTTP_400_BAD_REQUEST)
           
        
class ChangePasswordView(generics.GenericAPIView):
    """
    Changes user password
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(data=request.data, instance=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'response': 'Password updated sucessfully'}, status=status.HTTP_200_OK)


class ChangeEmailView(generics.GenericAPIView):
    """
    changes user email and sends verification email to new user
    """
    serializer_class = ChangeEmailSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(data=request.data, instance=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # sending verication to the new email
        token = RefreshToken.for_user(user).access_token
        current_site = get_current_site(request).domain
        relative_link = reverse('verify-email')
        absurl = 'http://' + current_site + relative_link + '?token=' + str(token)
        body = f"Hi {user.full_name}, use the link below to verify your new email \n {absurl}"
        data = {'body': body, 'subject': 'Verify your new email', 'to': [user.email]}
        send_email_task.delay(data)
        return Response({'response': 'Your email has been updated, We have sent verication link to your ntew email'}, status=status.HTTP_200_OK)


class UserDetailView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        print(request.headers)
        user = request.user
        serializer = self.serializer_class(instance=user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(data=request.data, instance=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    

class VerifyBVNView(generics.GenericAPIView):
    serializer_class = VerifyBVNSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.bvn_verified:
            return Response(data={'response': 'This account has already been verified'}, status=status.HTTP_200_OK)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            BVN = ((serializer.validated_data)['bvn'])
            response = get_bvn_details(BVN)
            if response.get('status_code') == 200:
                data = response['data'].get('data')
                user.first_name = data.get('first_name')
                user.last_name = data.get('last_name')
                user.full_name = f'{data.get("first_name")} {data.get("middle_name")} {data.get("last_name")}'
                bvn_dob = data.get('date_of_birth')
                dob = {'YYYY': bvn_dob[6:], 'MM': bvn_dob[3:5], 'DD': bvn_dob[:2]}
                user.dob = f"{dob['YYYY']}-{dob['MM']}-{dob['DD']}"
                user.phone_number = data.get('phone_number')
                user.bvn_verified = True
                user.save()
                return Response(data={'response': 'Your account has been verified'}, status=status.HTTP_200_OK)
            return Response(data={'error': 'Invalid bvn details'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsersView(generics.ListAPIView):
    serializer_class = UserForWallet
    queryset = UserModel.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'full_name', 'first_name', 'last_name', 'wallet__wallet_id']