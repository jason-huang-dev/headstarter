"""
File: apps.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Configuration for the 'Calendar' Django application.

This module defines the configuration class for the 'Calendar' application, including settings for auto-generated primary key fields and the application name.

For more information on Django apps configuration, see:
https://docs.djangoproject.com/en/5.0/ref/applications/
"""

from django.apps import AppConfig

class CalendarConfig(AppConfig):
    """
    Configuration class for the 'Calendar' application.

    This class inherits from `AppConfig` and is used to specify application-specific settings and behaviors.

    Attributes:
    - `default_auto_field` : str
        - Specifies the default type of auto-generated primary key fields for the application. Set to 'django.db.models.BigAutoField'.
    - `name` : str
        - The full Python path to the application. Set to 'calendar'.

    Example:
    ```python
    # In settings.py
    INSTALLED_APPS = [
        ...
        'calendar.apps.CalendarConfig',
        ...
    ]
    ```

    Note:
    - The `default_auto_field` attribute specifies the default field type for auto-generated primary keys in models within this app.
    - The `name` attribute specifies the application name as Django identifies it in settings and migration files.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'calendars'
