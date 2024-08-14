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
    ::field list(str) shared_users: The list of user emails that the calendar is shared to
    """
    list_display = ('title', 'user', 'get_shared_users', 'description')
    search_fields = ('title', 'user__email', 'shared_users__email')
    list_filter = ('user', 'shared_users')
    
    def get_shared_users(self, user_list):
        """
        Customizes the display of the shared users array in the admin interface.
        
        ::param list user_list: list of user emails
        ::return str : comma sparated str of user emails
        """
        return ", ".join([user.email for user in user_list.shared_users.all()])
