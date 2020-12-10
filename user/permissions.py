from rest_framework.permissions import BasePermission, SAFE_METHODS

class UpdateOwnProfile(BasePermission):
    message = "You are not allowed to do that"

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.id == request.user.id


class EmailVerified(BasePermission):
    message = "You need to verify your email address"

    def has_permission(self, request, view):
        return request.user.email_verified


class BVNVerified(BasePermission):
    message = "Verify your account through bvn"

    def has_permission(self, request, view):
        return request.user.bvn_verified