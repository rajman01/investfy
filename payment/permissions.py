from rest_framework.permissions import BasePermission, SAFE_METHODS

class ViewOwnAccount(BasePermission):
    message = "You are not allowed to view this account"

    def has_object_permission(self, request, view, obj):
        return obj.user.id == request.user.id