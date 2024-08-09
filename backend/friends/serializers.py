"""
File: serializers.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Serializers for the 'Friendships' Django application.

This module defines the `FriendshipsSerializer` class, which is used to serialize and deserialize `Friendships` model instances for API responses and requests.
"""

from rest_framework import serializers
from .models import Friendships

class FriendshipsSerializer(serializers.ModelSerializer):
    """
    Serializer for the `Friendships` model.

    This class inherits from `serializers.ModelSerializer` and is used to convert `Friendships` model instances to and from JSON.

    Attributes:
    - `Meta` : class
        - Contains the configuration for the serializer, including the model and fields to be serialized.

    Example:
    ```json
    {
        "user": 1,
        "friend": 2
    }
    ```

    Note:
    - Uses `serializers.ModelSerializer` to automatically generate fields based on the `Friendships` model.
    """
    class Meta:
        model = Friendships
        fields = ('user', 'friend')
