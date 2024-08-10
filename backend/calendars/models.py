"""
File: models.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-09

Defines the `Calendar` model for the calendar application.

This model represents a calendar owned by a user and includes fields for the user who owns it and the title of the calendar.

For more information on Django models, see:
https://docs.djangoproject.com/en/5.0/topics/db/models/
"""

from django.db import models
from django.conf import settings

class Calendar(models.Model):
    """
    Represents a calendar owned by a user.

    #### Fields
    - cal_id : AutoField
        - The primary key for the calendar, auto-incremented.
    - user : ForeignKey
        - The user who owns the calendar. Links to the `User` model.
    - title : CharField
        - The title of the calendar.
    - description : TextField
        - A description of the calendar.

    #### Methods
    - __str__() : str
        - Returns a string representation of the calendar's title.

    #### Example
    ```python
    calendar = Calendar(user=user_instance, title="My Calendar", desciption="desciption")
    print(calendar)  # Output: My Calendar
    ```
    """
    cal_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='calendars')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        """
        Returns a string with the title of the shared calendar.

        #### Returns:
        - str: The shared calendar title.
        """
        return self.title
