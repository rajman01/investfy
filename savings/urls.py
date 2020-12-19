from django.urls import path
from .views import (QuickSaveView, WalletCashOutView, WalletQuickSaveView,
                     TargetSaveView, TargetSaveCashoutView, WalletTargetSaveView, SetTargetView, 
                     QuickSaveAutoSaveView, JointSavingsView, JointSaveView, CreateJointSaveView,
                     AcceptJointSaveView, SaveToJointSaveView, InviteToJointSaveView, DisbandJointSaveView,
                     LeaveJointSave)


urlpatterns = [
    path('quicksave/<int:pk>', QuickSaveView.as_view()),
    path('quicksave/cashout', WalletCashOutView.as_view()),
    path('quicksave/save', WalletQuickSaveView.as_view()),
    path('targetsave/<int:pk>', TargetSaveView.as_view()),
    path('targetsave/cashout', TargetSaveCashoutView.as_view()),
    path('targetsave/save', WalletTargetSaveView.as_view()),
    path('targetsave/set', SetTargetView.as_view()),
    path('quicksave/autosave', QuickSaveAutoSaveView.as_view()),
    path('jointsave/<int:pk>', JointSaveView.as_view()),
    path('jointsavings', JointSavingsView.as_view()),
    path('jointsave/create', CreateJointSaveView.as_view()),
    path('jointsave/accept', AcceptJointSaveView.as_view(), name='accept-joint-saving'),
    path('jointsave/contribute/<int:pk>', SaveToJointSaveView.as_view()),
    path('jointsave/invite/<int:pk>', InviteToJointSaveView.as_view()),
    path('jointsave/disband/<int:pk>', DisbandJointSaveView.as_view()),
    path('jointsave/leave/<int:pk>', LeaveJointSave.as_view()),

]