"""
File: models.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-18

This module contains Django model for calendar invitations.
"""
from django.db import models
from django.conf import settings
from django.utils.crypto import get_random_string
from calendars.models import Calendar  # Adjust this import to match your project structure

class CalendarInvite(models.Model):
    """
    This model handles the invitation process for sharing calendars with other users via email.
    
    ::field ForeignKey calendar : The calendar being shared.
    ::field EmailField email : The email address of the invitee.
    ::field ForeignKey invited_by : The user who sent the invitation.
    ::field CharField token : A unique token for the invitation link.
    ::field BooleanField accepted : Tracks whether the invitation has been accepted.
    ::field BooleanField declined : Tracks whether the invitation has been declined.
    ::field DateTimeField created_at : The timestamp of when the invitation was created.
    """
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='invitations')
    email = models.EmailField()
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_invitations')
    token = models.CharField(max_length=50, unique=True, default=get_random_string)
    accepted = models.BooleanField(default=False)
    declined = models.BooleanField(default=False)  # New field to track declined invitations
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Returns a string representation of the invitation.
        
        ;:return str: A string representation in the format "Invitation to <email> for <calendar>".
        """
        return f"Invitation to {self.email} for {self.calendar.name}"

    def save(self, *args, **kwargs):
        """
        Overriding the save method to ensure a unique token is generated for each invitation.
        """
        if not self.token:
            self.token = get_random_string(32)
        super(CalendarInvite, self).save(*args, **kwargs)
