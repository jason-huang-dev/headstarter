"""
File: serializers.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-18

This module defines the `CalendarInviteSerializer` class, which is used to serialize and deserialize `CalendarInvite` model instances for API responses and requests.
"""

from rest_framework import serializers
from .models import CalendarInvite

class CalendarInviteSerializer(serializers.ModelSerializer):
    """
    This class inherits from `serializers.ModelSerializer` and is used to convert `CalendarInvite` model instances to and from JSON.

    ::field model : The model class that this serializer is for.
    ::field tuple fields : Specifies the fields to include in the serialized representation.
    """
    class Meta:
        model = CalendarInvite
        fields = ('calendar', 'email', 'invited_by', 'token', 'accepted', 'declined', 'created_at')
        read_only_fields = ['calendar', 'invited_by'] # I added this

