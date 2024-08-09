"""
File: serializers.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Defines the `EventSerializer` for the events application.

This serializer is used to convert `Event` model instances into JSON format and vice versa.

For more information on Django REST framework serializers, see:
https://www.django-rest-framework.org/api-guide/serializers/
"""
from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the `Event` model.

    Converts `Event` model instances to JSON and validates incoming data.

    ### Meta
    - `model` : Event
        - The model class that this serializer is for. Set to `Event`.
    - `fields` : tuple
        - Specifies the fields to include in the serialized representation. Set to `'__all__'` to include all fields.

    ### Example
    ```json
    {
        "calendar": 1,
        "title": "Meeting",
        "description": "Team meeting",
        "start_time": "2024-08-09T09:00:00Z",
        "end_time": "2024-08-09T10:00:00Z",
        "bg_color": "#FF5733",
        "user": 2
    }
    ```
    """
    class Meta:
        model = Event
        fields = '__all__'