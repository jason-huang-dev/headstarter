"""
File: serializers.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

This module provides a `CalendarSerializer` class for converting `Calendar` instances to and from JSON format for API responses.
"""

from rest_framework import serializers
from .models import Calendar

class CalendarSerializer(serializers.ModelSerializer):
    """
    This class converts `Calendar` instances to and from JSON format.

    ::meta int cal_id : The primary key for the calendar.
    ::meta int user : The ID of the user who owns the calendar.
    ::meta str title : The title of the calendar.
    ::meta TextField description : A description of the calendar.
    """
    class Meta:
        model = Calendar
        fields = ('cal_id', 'user', 'title', 'description')
        read_only_fields = ['cal_id', 'user'] # I added this
