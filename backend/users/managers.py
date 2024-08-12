"""
File: managers.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

This module defines `CustomUserManager` for handling user and superuser creation.
"""
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    """
    Inherits from `BaseUserManager` and provides methods for creating regular users and superusers.
    """
    def create_user(self, email, username, password, **extra_fields):
        """
        Creates and returns a regular user with the provided email, username, and password.

        ::param str email : The email address for the user.
        ::param str username : The username for the user.
        ::param str password : The password for the user.
        ::param kwargs **extra_fields : Additional fields to be set on the user.
        ::return User : The created user instance.
        ::raises ValueError : If the email is not provided.
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

        ::param str email : The email address for the user.
        ::param str username : The username for the user.
        ::param str password : The password for the user.
        ::param kwargs **extra_fields : Additional fields to be set on the user.
        ::return User : The created  superuser instance.
        ::raises ValueError : If `is_staff` or `is_superuser` is not set to `True` for the superuser
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, username, password, **extra_fields)