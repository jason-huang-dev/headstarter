"""
File: managers.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

Custom manager for user creation and management in Django.

This module defines `CustomUserManager` for handling user and superuser creation.
"""
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    """
    Custom manager for handling user creation and management.
    
    Inherits from `BaseUserManager` and provides methods for creating regular users and superusers.
    """
    def create_user(self, email, username, password, **extra_fields):
        """
        Creates and returns a regular user with the provided email, username, and password.

        #### Parameters
        - email : str
            - The email address for the user.
        - username : str
            - The username for the user.
        - password : str
            - The password for the user.
        - **extra_fields : kwargs
            - Additional fields to be set on the user.

        #### Returns
        - User
            - The created user instance.

        #### Raises
        - ValueError
            - If the email is not provided.

        #### Example
        ```python
        user = CustomUserManager().create_user(
            email='user@example.com',
            username='username',
            password='password'
        )
        ```
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password, **extra_fields):
        """
        Creates and returns a superuser with the provided email, username, and password.

        #### Parameters
        - email : str
            - The email address for the superuser.
        - username : str
            - The username for the superuser.
        - password : str
            - The password for the superuser.
        - **extra_fields : kwargs
            - Additional fields to be set on the superuser.

        #### Returns
        - User
            - The created superuser instance.

        #### Raises
        - ValueError
            - If `is_staff` or `is_superuser` is not set to `True` for the superuser.

        #### Example
        ```python
        superuser = CustomUserManager().create_superuser(
            email='admin@example.com',
            username='admin',
            password='password'
        )
        ```
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, username, password, **extra_fields)