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
    Admin configuration for the `Friendships` model.

    This class inherits from `admin.ModelAdmin` and is used to customize the display and behavior of the `Friendships`
    model in the Django admin interface.

    Attributes:
    - `list_display` : tuple
        - Specifies the fields to be displayed in the list view of the Django admin.
    - `search_fields` : tuple
        - Specifies the fields to be used for searching in the Django admin interface.
    - `ordering` : tuple
        - Specifies the default ordering of the records in the Django admin list view.
    """
    list_display = ('user', 'friend')
    search_fields = ('user__username', 'friend__username')
    ordering = ('user',)
