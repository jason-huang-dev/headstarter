"""
File: serializers.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

Serializer for user details in API responses.

Inherits from `UserDetailsSerializer` and includes additional fields for user details.
"""
from dj_rest_auth.serializers import UserDetailsSerializer
from django.contrib.auth import get_user_model

class CustomUserDetailsSerializer(UserDetailsSerializer):
    """
    Serializer for providing user details in API responses.

    Inherits from `UserDetailsSerializer` and includes additional fields for user details.

    #### Parameters
    - None

    #### Returns
    - dict
        - A dictionary containing user details with the following fields:
            - `id` : int
                - The unique identifier for the user.
            - `email` : str
                - The email address of the user.
            - `is_staff` : bool
                - Boolean indicating whether the user has admin access.
            - `is_active` : bool
                - Boolean indicating whether the user account is active.
            - `date_joined` : datetime
                - The date and time when the user account was created.

    #### Example
    ```json
    {
        "id": 1,
        "email": "user@example.com",
        "is_staff": false,
        "is_active": true,
        "date_joined": "2024-08-09T12:34:56Z"
    }
    ```

    #### Note
    - Inherits from `UserDetailsSerializer` and uses the `get_user_model()` function to dynamically get the user model.
    """
    class Meta(UserDetailsSerializer.Meta):
        model = get_user_model()
        fields = ('id', 'email', 'is_staff', 'is_active', 'date_joined')