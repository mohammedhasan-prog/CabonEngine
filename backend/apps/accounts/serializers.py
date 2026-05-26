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
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    tenant = serializers.CharField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if "username" in self.fields:
            self.fields["username"].required = False

    def validate(self, attrs):
        email = attrs.get("email")
        tenant = attrs.get("tenant")

        # Allow login by email; map to username expected by SimpleJWT.
        if email:
            user = User.objects.filter(email__iexact=email).first()
            if user:
                attrs["username"] = user.get_username()

        try:
            data = super().validate(attrs)
        except serializers.ValidationError:
            raise serializers.ValidationError(
                "Invalid email or password"
            )
        if tenant:
            user_tenant = self.user.tenant
            tenant_match = False
            if user_tenant:
                tenant_match = tenant in {str(user_tenant.id), user_tenant.slug}
            if not tenant_match:
                raise serializers.ValidationError(
                    "Tenant does not match selected workspace"
                )
        data["user"] = CurrentUserSerializer(self.user).data
        return data
