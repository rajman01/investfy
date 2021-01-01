from rest_framework import serializers
from .models import User
from .utils import generate_username
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from wallet.models import Wallet
from savings.models import QuickSave, TargetSave

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=68, min_length=6, write_only=True
    )

    class Meta:
        model = User
        fields = ['email', 'phone_number', 'full_name', 'password']
    def create(self, validated_data):
        username = generate_username(validated_data['full_name'])
        user = User.objects.create_user(
            username=username,
            password=validated_data['password'],
            email=validated_data['email']
        )
        token = Token.objects.create(user=user)
        token.save()
        user.phone_number = validated_data['phone_number']
        user.full_name = validated_data['full_name']
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(username=email, password=password)

        if not user:
            raise AuthenticationFailed('Invalid credentials')

        return user


class WalletForUser(serializers.ModelSerializer):
    has_set_wallet = serializers.BooleanField(source='has_password')
    class Meta:
        model = Wallet
        fields = ['id', 'wallet_id', 'balance', 'has_set_wallet']
        read_only_fields = ['id', 'balance', 'wallet_id', 'has_set_wallet']


class TargetSaveForUser(serializers.ModelSerializer):
    class Meta:
        model = TargetSave
        fields = ['id', 'targeted_saving', 'progress']
        read_only_fields = ['id', 'targeted_saving', 'progress']


class UserSerializer(serializers.ModelSerializer):
    wallet = WalletForUser(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'phone_number', 'email_verified', 
                    'bvn_verified', 'dob', 'total_savings', 'total_investments', 'wallet']
        read_only_fields = ['id', 'email', 'email_verified', 'bvn_verified', 'wallet']

    def update(self, instance, validated_data):
        username = validated_data['username']
        full_name = validated_data['full_name']
        phone_number = validated_data['phone_number']
        dob = validated_data['dob']
        instance.username = username
        if not instance.bvn_verified:
            instance.full_name = full_name
            instance.phone_number = phone_number
            instance.dob = dob
        else:
            if instance.full_name != full_name or instance.phone_number != phone_number or instance.dob != dob:
                raise serializers.ValidationError({'error': 'You cant change your name, phone_number, date of birth if you bvn is verified'})
            instannce.full_name = full_name
            instance.phone_number = phone_number
            instance.dob = dob
        instance.save()
        return instance



class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=528)

    class Meta:
        model = User
        fields = ['token']

class ChangePasswordSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(max_length=68, min_length=6)
    new_password = serializers.CharField(max_length=68, min_length=6)

    class Meta:
        model = User
        fields = ['current_password', 'new_password']
    
    def update(self, instance, validated_data):
        current_password = validated_data['current_password']
        new_password = validated_data['new_password']

        if instance.check_password(current_password):
            instance.set_password(new_password)
            instance.save()
            return instance
        raise serializers.ValidationError({'error': 'incorect password'})


class ChangeEmailSerializer(serializers.ModelSerializer):
    new_email = serializers.EmailField()

    class Meta:
        model = User
        fields = ['new_email']

    def validate_new_email(self, new_email):
        user = User.objects.filter(email=new_email).exists()
        if user:
            raise serializers.ValidationError(['Email already exists.'])
        return new_email

    def update(self, instance, validated_data):
        new_email = validated_data['new_email']
        if new_email == instance.email:
            raise serializers.ValidationError({'error': 'email can\'t be the same as before'})
        instance.email = new_email
        instance.email_verified = False
        instance.save()
        return instance

class VerifyBVNSerializer(serializers.Serializer):
    bvn = serializers.CharField(max_length=11, min_length=11)

    class Meta:
        fields = ['bvn']

    def validate_bvn(self, bvn):
        if not bvn.isdigit():
            raise serializers.ValidationError('Invalid bvn')
        return bvn