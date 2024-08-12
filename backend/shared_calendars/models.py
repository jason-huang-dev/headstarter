"""
File: models.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

This model represents an event in a calendar application and includes fields for the shared calendar, and users that have acces to it.
"""
from django.db import models
from django.conf import settings
from calendars.models import Calendar

class SharedCalendar(models.Model):
    """
    Represents a calendar shared with multiple users.

    ::field AutoField share_cal_id : The unique identifier for the shared calendar.
    ::field ForeignKey calendar : The calendar being shared.
    ::field ManyToManyField shared_users : Users with whom the calendar is shared.
    """
    share_cal_id = models.AutoField(primary_key=True)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='shared_calendars')
    shared_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='shared_calendars')

    def __str__(self):
        """
        Returns a string with the title of the shared calendar.

        ::return str: The shared calendar title.
        """
        return f"{self.calendar.title}"