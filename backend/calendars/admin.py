"""
File: admin.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

This module registers the `Calendar` model with the Django admin site and customizes its representation in the admin interface.
"""
from django.contrib import admin
from .models import Calendar

@admin.register(Calendar)
class CalendarAdmin(admin.ModelAdmin):
    """
    Customizes the display and behavior of the `Calendar` model in the Django admin interface.
    
    ::field str title : The title of the calendar
    ::field str user : The user who owns the calendar a foreign key
    ::field int cal_id: The id of the calendar in the database
    """
    list_display = ('title', 'user', 'cal_id')
