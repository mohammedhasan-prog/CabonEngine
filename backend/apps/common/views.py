from django.conf import settings
from django.http import JsonResponse
from django.utils import timezone


def health_check(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": "esg-backend",
            "environment": settings.ENVIRONMENT,
            "timestamp": timezone.now().isoformat(),
        }
    )
