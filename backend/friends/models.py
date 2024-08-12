"""
File: models.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

This model represents a friendship relationship between users and ensures that each friendship is unique.
"""

from django.db import models
from django.conf import settings

class Friendships(models.Model):
    """
    This model creates a many-to-many relationship between users, with a unique constraint to ensure that each friendship is unique and only defined once.

    ::field ForeignKey user : The user who is initiating the friendship.
    ::field ForeignKey friend : The user who is the friend.

    ::meta tuple unique_together : Ensures that each pair of users can only have one friendship record.
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

        ;:return str: A string representation of the friendship in the format "user -> friend".
        """
        return f"{self.user.username} -> {self.friend.username}"
