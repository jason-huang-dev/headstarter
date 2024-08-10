"""
File: serializers.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Defines the serializer for the `Calendar` model.

This module provides a `CalendarSerializer` class for converting `Calendar` instances to and from JSON format for API responses.

For more information on Django REST framework serializers, see:
https://www.django-rest-framework.org/api-guide/serializers/
"""

from rest_framework import serializers
from .models import Calendar

class CalendarSerializer(serializers.ModelSerializer):
    """
    Serializer for the `Calendar` model.

    This class converts `Calendar` instances to and from JSON format.

    #### Fields:
    - cal_id : int
        - The primary key for the calendar.
    - user : int
        - The ID of the user who owns the calendar.
    - title : str
        - The title of the calendar.
    - description : TextField
        - A description of the calendar.

    #### Example
    ```json
    {
        "cal_id": 1,
        "user": 1,
        "title": "My Calendar"
    }
    ```
    """
    class Meta:
        model = Calendar
        fields = ('cal_id', 'user', 'title', 'description')
