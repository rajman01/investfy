from django.contrib import admin
from .models import Investment, InvesmentTransaction

# Register your models here.

admin.site.register(Investment)
admin.site.register(InvesmentTransaction)
