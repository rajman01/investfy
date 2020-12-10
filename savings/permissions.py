from rest_framework.permissions import BasePermission

class ViewOwnSave(BasePermission):
    message = "You are not allowed to view this quicksave"

    def has_object_permission(self, request, view, obj):
        return request.user.id == obj.user.id
