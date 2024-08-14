"""
File: admin.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

This module registers the `Event` model with the Django admin site and customizes its admin interface using the `EventAdmin` class.
"""
from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """
    This class inherits from `ModelAdmin` and customizes the Django admin interface for managing `Event` instances.

    ::field str title : The title of the calendar
    ::field str user : The user who owns the calendar a foreign key
    ::field datetime start: The start time of the event
    ::field datetime end: The end time of the event
    """
    list_display = ('title', 'start', 'end', 'user')