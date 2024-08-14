"""
File: models.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

This model represents a calendar owned by a user and includes fields for the user who owns it and the title of the calendar.
"""

from django.db import models
from django.conf import settings

class Calendar(models.Model):
    """
    Represents a calendar owned by a user.

    ::field AutoField cal_id : The primary key for the calendar, auto-incremented.
    ::field ForeignKey user : The user who owns the calendar. Links to the `User` model.
    ::field CharField title : The title of the calendar.
    ::field TextField description : A description of the calendar.
    ::field ManyToManyField shared_users : List of shared users
    """
    cal_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='calendars')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    shared_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='shared_calendars', blank=True)

    def __str__(self):
        """
        Returns a string with the title of the shared calendar.
        
        ::return str: The shared calendar title.
        """
        return self.title
