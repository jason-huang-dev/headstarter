"""
File: apps.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Configuration for the 'Friendships' Django application.

This module defines the configuration class for the 'Friendships' application, which includes settings for auto-generated primary key fields and the application name.
"""

from django.apps import AppConfig

class FriendshipsConfig(AppConfig):
    """
    Configuration class for the 'Friendships' application.

    This class inherits from `AppConfig` and is used to specify application-specific settings and behaviors.

    Attributes:
    - `default_auto_field` : str
        - Specifies the default type of auto-generated primary key fields for the application. Set to 'django.db.models.BigAutoField'.
    - `name` : str
        - The full Python path to the application. Set to 'friendships'.

    Example:
    ```python
    # In settings.py
    INSTALLED_APPS = [
        ...
        'friendships.apps.FriendshipsConfig',
        ...
    ]
    ```

    Note:
    - The `default_auto_field` attribute specifies the default field type for auto-generated primary keys in models within this app.
    - The `name` attribute specifies the application name as Django identifies it in settings and migration files.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'friendships'
