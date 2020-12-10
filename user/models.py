from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    full_name = models.CharField(max_length=60)
    phone_number = models.CharField(max_length=11, unique=True, null=True, blank=True)
    email_verified = models.BooleanField(default=False)
    bvn_verified = models.BooleanField(default=False)
    dob = models.DateField(blank=True, null=True)

User._meta.get_field('email')._unique = True