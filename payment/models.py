from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class Bank(models.Model):
    name = models.CharField(max_length=128)
    code = models.CharField(max_length=32)

    def __str__(self):
        return self.name


class Account(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='accounts')
    bank = models.ForeignKey(Bank, on_delete=models.DO_NOTHING)
    number = models.CharField(max_length=10)
    name = models.CharField(max_length=128)

