from django.apps import AppConfig


class NormalizationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.normalization"

    def ready(self):
        # register signals
        from . import signals  # noqa: F401
