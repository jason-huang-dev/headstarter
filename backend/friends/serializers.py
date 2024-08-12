"""
File: serializers.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

This module defines the `FriendshipsSerializer` class, which is used to serialize and deserialize `Friendships` model instances for API responses and requests.
"""

from rest_framework import serializers
from .models import Friendships

class FriendshipsSerializer(serializers.ModelSerializer):
    """
    This class inherits from `serializers.ModelSerializer` and is used to convert `Friendships` model instances to and from JSON.

    ::field Event model : The model class that this serializer is for.
    ::field tuple fields : Specifies the fields to include in the serialized representation.
    """
    class Meta:
        model = Friendships
        fields = ('user', 'friend')
