from rest_framework import serializers
from .models import Account, Category, Transaction
from wallet.serializers import UserForWallet

class TransactionForCategory(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['amount', 'description', 'transaction_type', 'date']

class CategorySerializer(serializers.ModelSerializer):
    transactions = TransactionForCategory(many=True, requred=False)

    class Meta:
        model = Category
        fields = ['name', 'category_type', 'transactions']

class CategoryForTransaction(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'category_type']

class TransactionSerializer(serializers.ModelSerializer):
    category = CategoryForTransaction()
    
    class Meta:
        model = Transaction
        fields = ['amount', 'description', 'category', 'transaction_type', 'date']

class ManagementSerializer(serializers.ModelSerializer):
    user = UserForWallet(required=False)
    transactions = TransactionSerializer(many=True, required=False)

    class Meta:
        model = Account
        fields = "__all__"
        read_only_fields = ['user', 'transactions']

    def update(self, instance, validated_data):
        print(validated_data)
        name = validated_data['name']
        balance= validated_data['balance']
        instance.name = name
        instance.balance = balance
        instance.save()
        return instance