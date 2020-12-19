from django.contrib import admin
from .models import QuickSave, QuicksaveTransaction, TargetSave, TargetSavingTransaction, JointSave, JointSaveTransaction, JointSaveTrack

admin.site.register(QuickSave)
admin.site.register(QuicksaveTransaction)
admin.site.register(TargetSave)
admin.site.register(TargetSavingTransaction)
admin.site.register(JointSave)
admin.site.register(JointSaveTransaction)
admin.site.register(JointSaveTrack)
