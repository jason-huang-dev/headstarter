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
    repeated_dates = serializers.ListField(child=serializers.DateTimeField(), required=False)

    class Meta:
        model = Event
        fields = ['id', 'cal_id', 'title', 'description', 'start', 'end', 'bg_color', 'user', 'repeat_type', 'repeat_until', 'repeat_days', 'repeated_dates']

    def create(self, validated_data):
        repeated_dates = validated_data.pop('repeated_dates', [])
        event = Event.objects.create(**validated_data)
        event.set_repeated_dates(repeated_dates)
        event.save()
        return event

    def update(self, instance, validated_data):
        repeated_dates = validated_data.pop('repeated_dates', None)
        if repeated_dates is not None:
            instance.set_repeated_dates(repeated_dates)
        return super().update(instance, validated_data)