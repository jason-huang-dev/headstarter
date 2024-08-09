"""
File: apps.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

Configuration for the 'events' Django application.

This module defines the configuration class for the 'events' application, which includes settings for auto-generated primary key fields and the application name.
"""
from django.apps import AppConfig

class EventsConfig(AppConfig):
    """
    Configuration class for the 'events' application.

    This class inherits from `AppConfig` and is used to specify application-specific settings and behaviors.

    Attributes:
    - `default_auto_field` : str
        - Specifies the default type of auto-generated primary key fields for the application. Set to 'django.db.models.BigAutoField'.
    - `name` : str
        - The full Python path to the application. Set to 'events'.

    Example:
    ```python
    # In settings.py
    INSTALLED_APPS = [
        ...
        'events.apps.EventsConfig',
        ...
    ]
    ```

    Note:
    - The `default_auto_field` attribute specifies the default field type for auto-generated primary keys in models within this app.
    - The `name` attribute specifies the application name as Django identifies it in settings and migration files.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events'