from django.contrib import admin
from .models import QuickSave, QuicksaveTransaction, TargetSave, TargetSavingTransaction

admin.site.register(QuickSave)
admin.site.register(QuicksaveTransaction)
admin.site.register(TargetSave)
admin.site.register(TargetSavingTransaction)
