"""
File: admin.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Admin configuration for the 'Friendships' Django application.

This module registers the `Friendships` model with the Django admin interface and customizes the display options.
"""

from django.contrib import admin
from .models import Friendships

@admin.register(Friendships)
class FriendshipsAdmin(admin.ModelAdmin):
    """
    Customize the display and behavior of the `Friendships` model in the Django admin interface.

    ::field tuple list_display : Specifies the fields to be displayed in the list view of the Django admin.
    ::field tuple search_fields : Specifies the fields to be used for searching in the Django admin interface.
    ::field tuple ordering: Specifies the default ordering of the records in the Django admin list view.
    """
    list_display = ('user', 'friend')
    search_fields = ('user__username', 'friend__username')
    ordering = ('user',)
