"""
File: asgi.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

This module exposes the ASGI callable as a module-level variable named ``application``.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'calendar_app.settings')

application = get_asgi_application()
