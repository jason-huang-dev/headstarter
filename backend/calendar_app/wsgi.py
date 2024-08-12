"""
File: wsgi.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'calendar_app.settings')

application = get_wsgi_application()
