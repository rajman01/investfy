from django.urls import path
from .views import (QuickSaveView, QuickSaveCashOutView, QuickSaveDepositView, QuickSaveAutoSaveView,
                     TargetSaveView, TargetSavingsView, TargetSaveCashoutView, CreateTargetSaveView,
                     TargetSaveDepositView, TargetSaveDeleteView, TargetSaveAutoSaveView, JointTargetSavingsView,
                     JointTargetSaveView, CreateJointTargetSaveView, JointTargetSaveCashOut, JointTargetSaveDepositView,
                    JointTargetSaveDeleteView, JointTargetSaveInviteView, JointTargetSaveLeaveView,
                      JointSavingsView, JointSaveView, CreateJointSaveView,
                     AcceptJointSaveView, SaveToJointSaveView, InviteToJointSaveView, DisbandJointSaveView,
                     LeaveJointSave, JointSaveReactivateView)


urlpatterns = [
    path('quicksave', QuickSaveView.as_view()),
    path('quicksave/cashout', QuickSaveCashOutView.as_view()),
    path('quicksave/save', QuickSaveDepositView.as_view()),
    path('quicksave/autosave', QuickSaveAutoSaveView.as_view()),


    path('targetsave/<int:pk>', TargetSaveView.as_view()),
    path('targetsavings', TargetSavingsView.as_view()),
    path('targetsave/create', CreateTargetSaveView.as_view()),
    path('targetsave/cashout/<int:pk>', TargetSaveCashoutView.as_view()),
    path('targetsave/save/<int:pk>', TargetSaveDepositView.as_view()),
    path('targetsave/delete/<int:pk>', TargetSaveDeleteView.as_view()),
    path('targetsave/autosave/<int:pk>', TargetSaveAutoSaveView.as_view()),


    path('targetsave/joint/<int:pk>', JointTargetSaveView.as_view()),
    path('targetsavings/joint', JointTargetSavingsView.as_view()),
    path('targetsave/joint/create', CreateJointTargetSaveView.as_view()),
    path('targetsave/joint/cashout/<int:pk>', JointTargetSaveCashOut.as_view()),
    path('targetsave/joint/save/<int:pk>', JointTargetSaveDepositView.as_view()),
    path('targetsave/joint/delete/<int:pk>', JointTargetSaveDeleteView.as_view()),
    path('targetsave/joint/invite/<int:pk>', JointTargetSaveInviteView.as_view()),
    path('targetsave/joint/leave/<int:pk>', JointTargetSaveLeaveView.as_view()),


    path('jointsave/<int:pk>', JointSaveView.as_view()),
    path('jointsavings', JointSavingsView.as_view()),
    path('jointsave/create', CreateJointSaveView.as_view()),
    path('jointsave/accept', AcceptJointSaveView.as_view(), name='accept-joint-saving'),
    path('jointsave/contribute/<int:pk>', SaveToJointSaveView.as_view()),
    path('jointsave/invite/<int:pk>', InviteToJointSaveView.as_view()),
    path('jointsave/disband/<int:pk>', DisbandJointSaveView.as_view()),
    path('jointsave/leave/<int:pk>', LeaveJointSave.as_view()),
    path('jointsave/reactivate', JointSaveReactivateView.as_view(), name='Re-activate-joint-saving')

]