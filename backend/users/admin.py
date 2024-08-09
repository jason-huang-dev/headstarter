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
    Custom admin interface configuration for the `CustomUser` model.

    This class inherits from `UserAdmin` and customizes the Django admin interface for managing `CustomUser` instances.

    ### Parameters
    - None

    ### Attributes
    - `model` : Type[CustomUser]
        - The model class that this admin configuration is for. Set to `CustomUser`.
    - `list_display` : Tuple[str]
        - Specifies the fields to be displayed in the list view of the admin interface. Includes 'email', 'username', 'is_staff', and 'is_active'.
    - `list_filter` : Tuple[str]
        - Specifies the fields by which to filter the list view. Includes 'is_staff' and 'is_active'.
    - `fieldsets` : Tuple[Tuple[str, dict]]
        - Defines the layout of the fields in the edit form. Divided into sections such as None (general fields) and Permissions.
    - `add_fieldsets` : Tuple[Tuple[str, dict]]
        - Defines the layout of the fields in the add form. Includes 'email', 'username', 'password1', 'password2', 'is_staff', and 'is_active'.
    - `search_fields` : Tuple[str]
        - Specifies the fields to search within the admin interface. Includes 'email' and 'username'.
    - `ordering` : Tuple[str]
        - Specifies the default ordering of the list view. Orders by 'email'.

    ### Note
    - The `fieldsets` and `add_fieldsets` attributes are used to customize the layout of the user forms in the admin interface.
    - The `list_display` attribute determines which fields are shown in the list view.
    - The `search_fields` attribute allows searching by email and username.
    - The `ordering` attribute ensures that users are listed by email by default.
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