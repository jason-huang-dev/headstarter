"""
views.py

Author: Jason
Documentation updated by: Jason
Date: 2024-08-10

This module contains a Django view for creating a new event
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Event
from calendars.models import Calendar
from django.shortcuts import get_object_or_404

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    """
    Create a new event in a calendar.

    #### Parameters
    - calendar_id : int
        - The ID of the calendar to which the event will be added.
    - title : str
        - The title of the event.
    - description : str, optional
        - A description of the event.
    - start_time : datetime
        - The start date and time of the event.
    - end_time : datetime
        - The end date and time of the event.
    - bg_color : str, optional
        - The background color for the event in hexadecimal format. Defaults to '#FFFFFF'.

    #### Returns
    - Response
        - A JSON response with the created event's details.

    #### Raises
    - ValidationError
        - Raised if the provided data is invalid.
    - NotFound
        - Raised if the specified calendar does not exist.
    """
    calendar_id = request.data.get('calendar_id')
    title = request.data.get('title')
    description = request.data.get('description', '')
    start_time = request.data.get('start_time')
    end_time = request.data.get('end_time')
    bg_color = request.data.get('bg_color', '#FFFFFF')

    if not (calendar_id and title and start_time and end_time):
        return Response({'error': 'Calendar ID, title, start time, and end time are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        calendar = get_object_or_404(Calendar, cal_id=calendar_id)

        event = Event.objects.create(
            calendar=calendar,
            title=title,
            description=description,
            start_time=start_time,
            end_time=end_time,
            bg_color=bg_color,
            user=request.user
        )

        return Response({
            'event_id': event.pk,
            'title': event.title,
            'description': event.description,
            'start_time': event.start_time,
            'end_time': event.end_time,
            'bg_color': event.bg_color,
            'calendar_title': event.calendar.title
        }, status=status.HTTP_201_CREATED)

    except Calendar.DoesNotExist:
        return Response({'error': 'Calendar not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
