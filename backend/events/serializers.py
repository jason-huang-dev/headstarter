"""
File: serializers.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

This serializer is used to convert `Event` model instances into JSON format and vice versa.
"""
from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    """
    Converts `Event` model instances to JSON and validates incoming data.

    ::field Event model : The model class that this serializer is for. Set to `Event`.
    ::field tuple fields : Specifies the fields to include in the serialized representation. Set to `'__all__'` to include all fields.
    """
    class Meta:
        model = Event
        fields = '__all__'