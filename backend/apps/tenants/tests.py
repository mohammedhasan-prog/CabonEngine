from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Tenant


class CurrentTenantApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_model = get_user_model()

        self.tenant = Tenant.objects.create(name="Tenant A", slug="tenant-a")
        self.user = self.user_model.objects.create_user(
            username="tenant_user",
            password="Passw0rd123!",
            tenant=self.tenant,
            role="admin",
        )
        token = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(token.access_token)}")

    def test_get_current_tenant(self):
        response = self.client.get(reverse("tenant-current"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["slug"], "tenant-a")

    def test_patch_current_tenant_settings(self):
        response = self.client.patch(
            reverse("tenant-current"),
            {"settings": {"preferred_unit": "kwh"}},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["settings"]["preferred_unit"], "kwh")
