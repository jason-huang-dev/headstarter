"""
File: models.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Defines the `Friendships` model for managing user friendships in the application.

This model represents a friendship relationship between users and ensures that each friendship is unique.

For more information on Django models, see:
https://docs.djangoproject.com/en/5.0/topics/db/models/
"""

from django.db import models
from django.conf import settings

class Friendships(models.Model):
    """
    Model to represent friendships between users.

    This model creates a many-to-many relationship between users, 
    with a unique constraint to ensure that each friendship is unique 
    and only defined once.

    #### Attributes:
    - `user` : ForeignKey
        - The user who is initiating the friendship.
    - `friend` : ForeignKey
        - The user who is the friend.

    #### Meta:
    - `unique_together` : tuple
        - Ensures that each pair of users can only have one friendship record.

    #### Example:
    ```python
    friendship = Friendships.objects.create(user=user1, friend=user2)
    ```

    #### Note:
        - This model does not include any additional fields as friendships are simply a many-to-many relationship
        - The friendships listed are unidirectional meaning: 'a knows b, but b dosen't know a'
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friendships')
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friends_of')

    class Meta:
        unique_together = ('user', 'friend')
        verbose_name = 'Friendship'
        verbose_name_plural = 'Friendships'

    def __str__(self):
        """
        Returns a string representation of the friendship.

        Returns:
            str: A string representation of the friendship in the format "user -> friend".
        """
        return f"{self.user.username} -> {self.friend.username}"
