"""
File: admin.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Configures the Django admin interface for the `Calendar` model.

This module registers the `Calendar` model with the Django admin site and customizes its representation in the admin interface.

For more information on Django admin customization, see:
https://docs.djangoproject.com/en/5.0/ref/contrib/admin/
"""

from django.contrib import admin
from .models import Calendar

@admin.register(Calendar)
class CalendarAdmin(admin.ModelAdmin):
    """
    Admin interface for the `Calendar` model.

    Customizes the display and behavior of the `Calendar` model in the Django admin interface.

    #### List Display
    - `title` : The title of the calendar.
    - `user` : The user who owns the calendar.
    """
    list_display = ('title', 'user')
