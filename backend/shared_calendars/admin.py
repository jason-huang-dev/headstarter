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
    This class inherits from `ModelAdmin` and customizes the Django admin interface for managing `SharedCalendar` instances.

    ::field tuple list_display : Specifies the fields to be displayed in the list view of the admin interface. Includes:
    ::field AutoField share_cal_id : The unique identifier for the shared calendar.
    ::field ForeignKey calendar : The calendar being shared.
    ::field ManyToManyField shared_users : Users with whom the calendar is shared.
    """
    list_display = ('share_cal_id', 'calendar')