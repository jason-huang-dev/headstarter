"""
File: serializers.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Serializer for the `SharedCalendar` model in the 'SharedCalendar' Django application.

This module defines the `SharedCalendarSerializer` class, which is used to serialize and 
deserialize `SharedCalendar` instances for API interactions.

For more information on Django REST Framework serializers, see:
https://www.django-rest-framework.org/api-guide/fields/
"""

from rest_framework import serializers
from .models import SharedCalendar

class SharedCalendarSerializer(serializers.ModelSerializer):
    """
    Serializer for the `SharedCalendar` model.

    This serializer converts `SharedCalendar` instances to JSON and validates input data 
    for `SharedCalendar` creation or updates.

    Attributes:
    - `share_cal_id` : IntegerField
        - The unique identifier for the shared calendar.
    - `calendar` : PrimaryKeyRelatedField
        - The calendar associated with the shared calendar.
    - `shared_users` : PrimaryKeyRelatedField(many=True)
        - The users who have access to the shared calendar.

    Example:
    ```json
    {
        "share_cal_id": 1,
        "calendar": 2,
        "shared_users": [1, 2, 3]
    }
    ```
    """
    class Meta:
        model = SharedCalendar
        fields = ['share_cal_id', 'calendar', 'shared_users']
