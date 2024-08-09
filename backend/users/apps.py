"""
File: apps.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

Configuration for the 'users' application in Django.

This module defines the `UsersConfig` class for application-specific settings and behaviors.
"""
from django.apps import AppConfig

class UsersConfig(AppConfig):
    """
    Configuration class for the 'users' application.

    This class inherits from `AppConfig` and is used to configure application-specific settings and behaviors.

    #### Parameters
    - None

    #### Attributes
    - `default_auto_field` : str
        - Specifies the default type of auto-generated primary key fields for the application. Set to 'django.db.models.BigAutoField'.
    - `name` : str
        - The full Python path to the application. Set to 'users'.

    #### Example
    ```python
    # In settings.py
    INSTALLED_APPS = [
        ...
        'users.apps.UsersConfig',
        ...
    ]
    ```

    #### Note
    - The `default_auto_field` attribute specifies the default field type for auto-generated primary keys in models within this app.
    - The `name` attribute specifies the application name as Django identifies it in settings and migration files.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'