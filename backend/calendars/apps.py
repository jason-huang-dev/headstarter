"""
File: apps.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

This module defines the configuration class for the 'Calendar' application, including settings for auto-generated primary key fields and the application name.
"""

from django.apps import AppConfig

class CalendarConfig(AppConfig):
    """
    This class inherits from `AppConfig` and is used to specify application-specific settings and behaviors.

    ::field str default_auto_field : specifies the default field type for auto-generated primary keys in models within this app.
    ::field str name : specifies the application name as Django identifies it in settings and migration files.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'calendars'
