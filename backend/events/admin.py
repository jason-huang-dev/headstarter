"""
File: admin.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

Admin configuration for the `Event` model in the Django admin interface.

This module registers the `Event` model with the Django admin site and customizes its admin interface using the `EventAdmin` class.
"""
from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """
    Admin interface configuration for the `Event` model.

    This class inherits from `ModelAdmin` and customizes the Django admin interface for managing `Event` instances.

    Attributes:
    - `list_display` : tuple
        - Specifies the fields to be displayed in the list view of the admin interface. Includes:
            - `title` : str
                - The title of the event.
            - `start_time` : datetime
                - The start time of the event.
            - `end_time` : datetime
                - The end time of the event.
            - `user` : ForeignKey
                - The user associated with the event.

    Note:
    - The `list_display` attribute determines which fields are shown in the list view of the admin interface.
    """
    list_display = ('title', 'start_time', 'end_time', 'user')