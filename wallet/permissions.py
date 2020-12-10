from rest_framework.permissions import BasePermission

class ViewOwnWallet(BasePermission):
    message = "You are not allowed to view this wallet"

    def has_object_permission(self, request, view, obj):
        return request.user.id == obj.owner.id