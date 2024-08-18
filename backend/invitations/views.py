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

        serializer = CalendarInviteSerializer(invite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_invitation(request, token):
    """
    Respond to a calendar invitation (accept or decline).

    ::param str token : The token associated with the invitation.
    ::param str action : The action to take ('accept' or 'decline').
    ::return Response : A JSON response indicating the success or failure of the operation.
    """
    action = request.data.get('action')  # 'accept' or 'decline'

    if action not in ['accept', 'decline']:
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        invite = get_object_or_404(CalendarInvite, token=token, email=request.user.email)

        if invite.accepted or invite.declined:
            return Response({'error': 'Invitation has already been responded to'}, status=status.HTTP_400_BAD_REQUEST)

        if action == 'accept':
            invite.accepted = True
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
    serializer = CalendarInviteSerializer(invitations, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)
