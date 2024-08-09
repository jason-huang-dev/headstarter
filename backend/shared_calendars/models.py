"""
File: models.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Defines the `SharedCalendar` model for the shared calendars application.

This model represents an event in a calendar application and includes fields for the shared calendar, and users that have acces to it.

For more information on Django models, see:
https://docs.djangoproject.com/en/5.0/topics/db/models/
"""
from django.db import models
from django.conf import settings
from calendars.models import Calendar

class SharedCalendar(models.Model):
    """
    Represents a calendar shared with multiple users.

    #### Fields
    - share_cal_id : AutoField
        - The unique identifier for the shared calendar.
    - calendar : ForeignKey
        - The calendar being shared.
    - shared_users : ManyToManyField
        - Users with whom the calendar is shared.

    #### Methods
    - __str__() : str
        - Returns a string representation of the shared calendar.
    """
    share_cal_id = models.AutoField(primary_key=True)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='shared_calendars')
    shared_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='shared_calendars')

    def __str__(self):
        """
        Returns a string with the title of the shared calendar.

        #### Returns:
        - str: The shared calendar title.
        """
        return f"{self.calendar.title}"