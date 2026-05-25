from rest_framework.permissions import BasePermission, SAFE_METHODS


class CanModifyRecord(BasePermission):
    message = "You do not have permission to modify records."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        return request.user.role in {"analyst", "admin"}
