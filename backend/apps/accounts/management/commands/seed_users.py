from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.tenants.models import Tenant


class Command(BaseCommand):
    help = "Create demo tenants and users for local testing."

    @transaction.atomic
    def handle(self, *args, **options):
        tenants = [
            ("Global Logistics Corp", "glc"),
            ("Tesla India Mfg", "tim"),
            ("EcoRetail Europe", "ere"),
        ]

        tenant_map = {}
        for name, slug in tenants:
            tenant, _ = Tenant.objects.get_or_create(
                slug=slug,
                defaults={"name": name, "is_active": True},
            )
            tenant_map[slug] = tenant

        User = get_user_model()
        users = [
            {
                "username": "analyst.glc",
                "email": "analyst@glc.com",
                "role": "analyst",
                "tenant": tenant_map["glc"],
                "password": "Passw0rd!",
            },
            {
                "username": "admin.glc",
                "email": "admin@glc.com",
                "role": "admin",
                "tenant": tenant_map["glc"],
                "password": "Passw0rd!",
                "is_staff": True,
                "is_superuser": True,
            },
            {
                "username": "viewer.glc",
                "email": "viewer@glc.com",
                "role": "viewer",
                "tenant": tenant_map["glc"],
                "password": "Passw0rd!",
            },
            {
                "username": "analyst.tim",
                "email": "analyst@tim.com",
                "role": "analyst",
                "tenant": tenant_map["tim"],
                "password": "Passw0rd!",
            },
            {
                "username": "analyst.ere",
                "email": "analyst@ere.com",
                "role": "analyst",
                "tenant": tenant_map["ere"],
                "password": "Passw0rd!",
            },
        ]

        created = 0
        for payload in users:
            password = payload.pop("password")
            user, is_created = User.objects.get_or_create(
                username=payload["username"],
                defaults=payload,
            )
            if not is_created:
                for key, value in payload.items():
                    setattr(user, key, value)
            user.set_password(password)
            user.save()
            if is_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded users. Created {created} new users."))
