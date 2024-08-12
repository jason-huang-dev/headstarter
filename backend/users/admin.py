"""
File: admin.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

Django admin configuration for the `CustomUser` model.

This module customizes the Django admin interface for managing `CustomUser` instances by extending `UserAdmin`.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    """
    This class inherits from `UserAdmin` and customizes the Django admin interface for managing `CustomUser` instances.

    ::field type[CustomUser] model : The model class that this admin configuration is for. 
    ::field tuple[str] list_display : Specifies the fields to be displayed in the list view of the admin interface. Includes 'email', 'username', 'is_staff', and 'is_active'.
    ::field tuple[str] list_filter : Specifies the fields by which to filter the list view. Includes 'is_staff' and 'is_active'.
    ::field tuple[tuple[str, dict]] fieldsets : Defines the layout of the fields in the edit form. Divided into sections such as None (general fields) and Permissions.
    ::field tuple[tuple[str, dict]] add_fieldsets : Defines the layout of the fields in the add form. Includes 'email', 'username', 'password1', 'password2', 'is_staff', and 'is_active'.
    ::field tuple[str] search_fields : Specifies the fields to search within the admin interface. Includes 'email' and 'username'.
    ::field tuple[str] ordering : Specifies the default ordering of the list view. Orders by 'email'.
    """
    model = CustomUser
    list_display = ('email', 'username', 'is_staff', 'is_active',)
    list_filter = ('is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email', 'username',)
    ordering = ('email',)

admin.site.register(CustomUser, CustomUserAdmin)