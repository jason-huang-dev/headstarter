"""
File: models.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

This model inherits from `AbstractBaseUser` and `PermissionsMixin` to provide a custom user model with email as the primary identifier.
"""
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.conf import settings
from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Represents a custom user model with email-based authentication and additional field.

    ::field str email : The email address of the user, which is unique and used for authentication.
    ::field str username : The username of the user.
    ::field ImageField profile_picture : The profile picture of the user. Defaults to `settings.DEFAULT_PROFILE_PIC`.
    ::field bool is_staff : A boolean indicating whether the user has access to the admin interface. Defaults to `False`.
    ::field bool is_active : A boolean indicating whether the user account is active. Defaults to `True`.
    ::field DateTimeField date_joined : The date and time when the user account was created. Defaults to the current timestamp.
    ::return str : The email address of the user as a string.
    ::raises ValueError : Raised if there is an issue with user creation or authentication.
    """
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(_('username'), max_length=255)
    profile_picture = models.ImageField(upload_to='profile_pics', default=settings.DEFAULT_PROFILE_PIC)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_field = ['username']

    objects = CustomUserManager()

    def __str__(self):
        """
        Returns the email address of the user.

        #### Returns:
            str: The email address of the user.
        """
        return self.email