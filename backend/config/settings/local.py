"""Local development settings."""

from .base import *

DEBUG = True
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1,0.0.0.0,testserver")
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
