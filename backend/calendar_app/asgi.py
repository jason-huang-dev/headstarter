"""
File: asgi.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

ASGI config for the calendar_app project.

This module exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see:
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'calendar_app.settings')

application = get_asgi_application()
