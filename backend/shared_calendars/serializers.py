"""
File: serializers.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

This module defines the `SharedCalendarSerializer` class, which is used to serialize and deserialize `SharedCalendar` instances for API interactions.
"""

from rest_framework import serializers
from .models import SharedCalendar

class SharedCalendarSerializer(serializers.ModelSerializer):
    """
    This serializer converts `SharedCalendar` instances to JSON and validates input data for `SharedCalendar` creation or updates.

    Attributes:
    ::meta IntegerField share_cal_id : The unique identifier for the shared calendar.
    ::meta PrimaryKeyRelatedField calendar : The calendar associated with the shared calendar.
    ::meta PrimaryKeyRelatedField(many=True) shared_users : The users who have access to the shared calendar.
    """
    class Meta:
        model = SharedCalendar
        fields = ['share_cal_id', 'calendar', 'shared_users']
