"""
File: views.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-10

This module contains a Django view for creating a new shared calendar under a passed user object and calendar id
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import SharedCalendar
from calendars.models import Calendar
from django.shortcuts import get_object_or_404

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_shared_calendar(request):
    """
    Share a calendar with multiple users.

    #### Parameters
    ::param int calendar_id : The ID of the calendar to be shared.
    ::param list user_ids : A list of user IDs to whom the calendar should be shared.
    ::return Response : A JSON response indicating success or failure.
    ::raises ValidationError : Raised if the provided data is invalid.
    ::raises NotFound : Raised if the specified calendar does not exist.
    """
    calendar_id = request.data.get('calendar_id')
    user_ids = request.data.get('user_ids', [])

    if not calendar_id or not user_ids:
        return Response({'error': 'Calendar ID and user IDs are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        calendar = get_object_or_404(Calendar, cal_id=calendar_id, user=request.user)

        # Create or update the shared calendar
        shared_calendar, created = SharedCalendar.objects.get_or_create(calendar=calendar)
        
        # Set the shared users
        shared_calendar.shared_users.set(user_ids)
        shared_calendar.save()

        return Response({'message': 'Calendar shared successfully'}, status=status.HTTP_201_CREATED)

    except Calendar.DoesNotExist:
        return Response({'error': 'Calendar not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
