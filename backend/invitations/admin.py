"""
File: admin.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-18

Admin configuration for the 'Invitations' Django application.

This module registers the `CalendarInvite` model with the Django admin interface and customizes the display options.
"""

from django.contrib import admin
from .models import CalendarInvite

@admin.register(CalendarInvite)
class CalendarInviteAdmin(admin.ModelAdmin):
    """
    Customize the display and behavior of the `CalendarInvite` model in the Django admin interface.

    ::field tuple list_display : Specifies the fields to be displayed in the list view of the Django admin.
    ::field tuple search_fields : Specifies the fields to be used for searching in the Django admin interface.
    ::field tuple ordering : Specifies the default ordering of the records in the Django admin list view.
    """
    list_display = ('calendar', 'email', 'invited_by', 'accepted', 'declined', 'created_at')
    search_fields = ('email', 'calendar__name', 'invited_by__username')
    ordering = ('-created_at',)
