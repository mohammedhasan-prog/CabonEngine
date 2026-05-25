from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class TenantSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    slug = serializers.CharField()


class CurrentUserSerializer(serializers.ModelSerializer):
    tenant = TenantSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "role", "tenant")


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = CurrentUserSerializer(self.user).data
        return data
