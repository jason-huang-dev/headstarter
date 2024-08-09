"""
File: models.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

Defines the `Event` model for the events application.

This model represents an event in a calendar application and includes fields for event details, such as title, description, timing, and associated user.

For more information on Django models, see:
https://docs.djangoproject.com/en/5.0/topics/db/models/
"""
from django.db import models
from django.conf import settings
    
class Event(models.Model):
    """
    Represents an event in a calendar application.

    Attributes:
    - `calendar` : ForeignKey
        - Links the event to a calendar. Uses the 'Calendars' model with a CASCADE delete policy.
    - `title` : CharField
        - The title of the event. Max length of 255 characters.
    - `description` : TextField
        - A textual description of the event. Can be null or blank.
    - `start_time` : DateTimeField
        - The start date and time of the event.
    - `end_time` : DateTimeField
        - The end date and time of the event.
    - `bg_color` : CharField
        - Background color for the event in hexadecimal format. Defaults to '#FFFFFF'.
    - `user` : ForeignKey
        - Links the event to a user. Uses the `AUTH_USER_MODEL` with a CASCADE delete policy.

    Methods:
    - `__str__()` :
        - Returns a string representation of the event in the format "title - calendar title".
    """
    calendar = models.ForeignKey('Calendars', on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    bg_color = models.CharField(max_length=7, default='#FFFFFF')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        """
        Returns a string representation of the event.

        #### Returns:
        - str: The event title followed by the calendar title.
        """
        return f"{self.title} - {self.calendar.title}"