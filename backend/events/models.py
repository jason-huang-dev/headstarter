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
import json
from django.utils import timezone
from datetime import datetime

class Event(models.Model):
    """
    Represents an event in a calendar application.

    fieldibutes:
    ::field ForeignKey calendar : Links the event to a calendar. Uses the 'Calendars' model with a CASCADE delete policy.
    ::field CharField title : The title of the event. Max length of 255 characters.
    ::field TextField description : A textual description of the event. Can be null or blank.
    ::field DateTimeField start : The start date and time of the event.
    ::field DateTimeField end : The end date and time of the event.
    ::field CharField bg_color : Background color for the event in hexadecimal format. Defaults to '#FFFFFF'.
    ::field ForeignKey user : Links the event to a user. Uses the `AUTH_USER_MODEL` with a CASCADE delete policy.
    """
    REPEAT_CHOICES = [
        ('NONE', 'Does not repeat'),
        ('DAILY', 'Daily'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
        ('YEARLY', 'Yearly'),
    ]

    cal_id = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    start = models.DateTimeField()
    end = models.DateTimeField()
    bg_color = models.CharField(max_length=7, default='#808080')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # New fields for repeating events
    repeat_type = models.CharField(max_length=10, choices=REPEAT_CHOICES, default='NONE')
    repeat_until = models.DateTimeField(null=True, blank=True)
    repeat_days = models.JSONField(null=True, blank=True)  # For storing days of the week for weekly repeats
    repeated_dates = models.JSONField(default=list, blank=True)  # New field to store repeated dates

    def __str__(self):
        """
        Returns a string representation of the event.

        ::return str: The event title followed by the calendar title.
        """
        return f"{self.title}"
    
    def set_repeated_dates(self, dates):
        # Handle both datetime objects and string inputs
        self.repeated_dates = [
            date.isoformat() if isinstance(date, (datetime, timezone.datetime)) else date
            for date in dates
        ]

    def get_repeated_dates(self):
        # Convert strings to datetime objects when retrieving
        return [
            timezone.datetime.fromisoformat(date) if isinstance(date, str) else date
            for date in self.repeated_dates
        ]