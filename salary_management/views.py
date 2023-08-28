from rest_framework import viewsets, permissions
from .serializers import ManagementSerializer
from .models import Account


class AccountViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = ManagementSerializer

    def get_queryset(self):
        return self.request.user.managements.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
