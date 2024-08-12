"""
File: models.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

This model represents an event in a calendar application and includes fields for event details, such as title, description, timing, and associated user.
"""
from django.db import models
from django.conf import settings
from calendars.models import Calendar
    
class Event(models.Model):
    """
    Represents an event in a calendar application.

    fieldibutes:
    ::field ForeignKey calendar : Links the event to a calendar. Uses the 'Calendars' model with a CASCADE delete policy.
    ::field CharField title : The title of the event. Max length of 255 characters.
    ::field TextField description : A textual description of the event. Can be null or blank.
    ::field DateTimeField start_time : The start date and time of the event.
    ::field DateTimeField end_time : The end date and time of the event.
    ::field CharField bg_color : Background color for the event in hexadecimal format. Defaults to '#FFFFFF'.
    ::field ForeignKey user : Links the event to a user. Uses the `AUTH_USER_MODEL` with a CASCADE delete policy.
    """
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    bg_color = models.CharField(max_length=7, default='#FFFFFF')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        """
        Returns a string representation of the event.

        ::return str: The event title followed by the calendar title.
        """
        return f"{self.title} - {self.calendar.title}"