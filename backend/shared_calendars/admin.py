"""
File: admin.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Admin configuration for the `SharedCalendar` model in the Django admin interface.

This module registers the `SharedCalendar` model with the Django admin site and customizes its admin interface using the `SharedCalendarAdmin` class.
"""
from django.contrib import admin
from .models import SharedCalendar

@admin.register(SharedCalendar)
class SharedCalendarAdmin(admin.ModelAdmin):
    """
    Admin interface configuration for the `SharedCalendar` model.

    This class inherits from `ModelAdmin` and customizes the Django admin interface for managing `SharedCalendar` instances.

    Attributes:
    - `list_display` : tuple
        - Specifies the fields to be displayed in the list view of the admin interface. Includes:
            - share_cal_id : AutoField
                - The unique identifier for the shared calendar.
            - calendar : ForeignKey
                - The calendar being shared.
            - shared_users : ManyToManyField
                - Users with whom the calendar is shared.


    Note:
    - The `list_display` attribute determines which fields are shown in the list view of the admin interface.
    """
    list_display = ('share_cal_id', 'calendar')