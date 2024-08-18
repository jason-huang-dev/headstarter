"""
File: views.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-18

This module contains Django views for managing calendar invitations.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CalendarInvite
from calendars.models import Calendar
from .serializers import CalendarInviteSerializer
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from django.core.exceptions import ValidationError

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_invitation(request):
    """
    Create a new calendar invitation for a specified email address.

    ::param str email : The email address of the user to be invited.
    ::param int calendar_id : The ID of the calendar to which the user is being invited.
    ::return Response : A JSON response indicating the success or failure of the operation.
    ::raises ValidationError : Raised if the invitation cannot be created.
    """
    email = request.data.get('email')
    calendar_id = request.data.get('calendar_id')

    if not email or not calendar_id:
        return Response({'error': 'Email and calendar ID are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if the calendar exists
        calendar = get_object_or_404(Calendar, id=calendar_id)
        
        # Check if the user is already invited
        if CalendarInvite.objects.filter(email=email, calendar=calendar).exists():
            return Response({'error': 'Invitation already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the invitation
        invite = CalendarInvite.objects.create(
            calendar=calendar,
            email=email,
            invited_by=request.user,
            token=get_random_string(32)  # Generate a unique token
        )

        serializer = CalendarInviteSerializer(invite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_invitation(request, token):
    """
    Accept a calendar invitation.

    ::param str token : The token associated with the invitation.
    ::return Response : A JSON response indicating the success or failure of the operation.
    """
    try:
        invite = get_object_or_404(CalendarInvite, token=token, email=request.user.email)
        
        if invite.accepted or invite.declined:
            return Response({'error': 'Invitation has already been responded to'}, status=status.HTTP_400_BAD_REQUEST)

        invite.accepted = True
        invite.save()

        return Response({'message': 'Invitation accepted'}, status=status.HTTP_200_OK)

    except CalendarInvite.DoesNotExist:
        return Response({'error': 'Invitation not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def decline_invitation(request, token):
    """
    Decline a calendar invitation.

    ::param str token : The token associated with the invitation.
    ::return Response : A JSON response indicating the success or failure of the operation.
    """
    try:
        invite = get_object_or_404(CalendarInvite, token=token, email=request.user.email)
        
        if invite.accepted or invite.declined:
            return Response({'error': 'Invitation has already been responded to'}, status=status.HTTP_400_BAD_REQUEST)

        invite.declined = True
        invite.save()

        return Response({'message': 'Invitation declined'}, status=status.HTTP_200_OK)

    except CalendarInvite.DoesNotExist:
        return Response({'error': 'Invitation not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
