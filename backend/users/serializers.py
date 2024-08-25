"""
File: serializers.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

Inherits from `UserDetailsSerializer` and includes additional fields for user details.
"""
from dj_rest_auth.serializers import UserDetailsSerializer
from django.contrib.auth import get_user_model

class CustomUserDetailsSerializer(UserDetailsSerializer):
    """
    Inherits from `UserDetailsSerializer` and includes additional fields for user details.

    ::meta int id : The unique identifier for the user.
    ::meta str email : The email address of the user.
    ::meta bool is_staff : Boolean indicating whether the user has admin access.
    ::meta bool is_active : Boolean indicating whether the user account is active.
    ::meta datetime date_joined : The date and time when the user account was created.
    """
    class Meta(UserDetailsSerializer.Meta):
        model = get_user_model()
        fields = ('username', 'id', 'email', 'is_staff', 'is_active', 'date_joined')