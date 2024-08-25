"""
File: views.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-18

This module contains Django views for managing calendar invitations.
"""

from datetime import timezone
from django.template.loader import render_to_string
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import EmailMessage
from rest_framework import status
from .models import CalendarInvite
from calendars.models import Calendar
from .serializers import CalendarInviteSerializer
from users.models import CustomUser
from users.serializers import CustomUserDetailsSerializer
from calendars.serializers import CalendarSerializer
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_invitation(request):
    """
    Create a new calendar invitation for a specified email address.

    ::param str email : The email address of the user to be invited.
    ::param int calendar_id : The ID of the calendar to which the user is being invited.
    ::return Response : A JSON response indicating the success or failure of the operation.
    """
    email = request.data.get('email')
    cal_id = request.data.get('cal_id')

    if not email or not cal_id:
        return Response({'error': 'Email and calendar ID are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        calendar = get_object_or_404(Calendar, id=cal_id)

        if CalendarInvite.objects.filter(email=email, calendar=calendar).exists():
            return Response({'error': 'Invitation already exists'}, status=status.HTTP_400_BAD_REQUEST)

        invite = CalendarInvite.objects.create(
            calendar=calendar,
            email=email,
            invited_by=request.user,
            token=get_random_string(32)  # Generate a unique token
        )
        
        # Prepare email content
        subject = f"You've been invited to the calendar: {calendar.name}"
        context = {
            'calendar_name': calendar.name,
            'invited_by': request.user.username,
            'current_year': timezone.now().year
        }
        html_message = render_to_string('emails/invitation_email.html', context)

        # Create the EmailMessage object
        email_message = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email]
        )
        email_message.content_subtype = "html"  # Set the email content to HTML

        # Send the email
        email_message.send()

        serializer = CalendarInviteSerializer(invite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_invitation(request):
    """
    Respond to a calendar invitation (accept or decline).

    ::param str action : The action to take ('accept' or 'decline').
    ::return Response : A JSON response indicating the success or failure of the operation.
    """
    action = request.data.get('action')  # 'accept' or 'decline'
    token = request.data.get('token')

    if action not in ['accept', 'decline']:
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        invite = get_object_or_404(CalendarInvite, token=token, email=request.user.email)

        if invite.accepted or invite.declined:
            return Response({'error': 'Invitation has already been responded to'}, status=status.HTTP_400_BAD_REQUEST)

        if action == 'accept':
            invite.accepted = True
            shared_user = get_object_or_404(CustomUser, email=invite.email)
            if shared_user:
                invite.calendar.shared_users.add(shared_user)
            else:
                return Response({'error': 'Shared user not found'}, status=status.HTTP_404_NOT_FOUND)
        elif action == 'decline':
            invite.declined = True

        invite.save()
        return Response({'message': f'Invitation {action}ed'}, status=status.HTTP_200_OK)

    except CalendarInvite.DoesNotExist:
        return Response({'error': 'Invitation not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_invites_by_email(request):
    """
    Retrieve all calendar invitations related to a specified email address.

    ::param str email : The email address to filter invitations.
    ::return Response : A JSON response containing the list of invitations.
    """
    email = request.user.email

    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    invitations = CalendarInvite.objects.filter(email=email)
    
    # If no invitations are found
    if not invitations.exists():
        return Response({'message': 'No invitations found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Create a structured response
    invitation_data = []
    for invite in invitations:
        invitation_data.append({
            'inv_id': invite.id,
            'calendar': CalendarSerializer(invite.calendar).data,
            'email': invite.email,
            'invited_by': CustomUserDetailsSerializer(invite.invited_by).data,
            'token': invite.token,
            'accepted': invite.accepted,
            'declined': invite.declined,
            'created_at': invite.created_at.isoformat(),
        })

    return Response(invitation_data, status=status.HTTP_200_OK)