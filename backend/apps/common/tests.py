from django.test import Client, SimpleTestCase
from django.urls import reverse


class HealthCheckTests(SimpleTestCase):
    def test_health_endpoint_returns_ok(self):
        client = Client()
        response = client.get(reverse("health-check"))

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {
                "status": "ok",
                "service": "esg-backend",
                "environment": "local",
                "timestamp": response.json()["timestamp"],
            },
        )
