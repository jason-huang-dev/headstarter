"""
File: views.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-10

This module contains a Django view for creating a new calendar under a passed user object
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Calendar
from .serializers import CalendarSerializer

import logging
logger = logging.getLogger(__name__)

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def calendar_view(request):
    """
    Manage calendars for the authenticated user
    
    ::param HTTPRequest request : The HTTP request object
    ::return JSON : a JSON response with the calendar data or an error message

    - @GET: Retrieve all calendars for the user.
    - @POST: Create a new calendar for the user.
    
    """
    if request.method == 'GET':
        return get_calendars(request)
    elif request.method == 'POST':
        return create_calendar(request)


def get_calendars(request):
    """
    Create a new calendar for the authenticated user.

    ::param user.token user : The user key to filter for
    ::return Response : A JSON response containing all the calendars related to an user
    ::raises ValidationError : Raised if the provided data is invalid
    """
    try:
        calendars = Calendar.objects.filter(user=request.user)
        serializer = CalendarSerializer(calendars, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error retrieving or creating calendar")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




def create_calendar(request):
    """
    Create a new calendar for the authenticated user.

    ::param str title : The title of the calendar.
    ::param str description : An optional description of the calendar.
    ::param list shared_users : List of emails to share the calendar with.
    ::return Response : A JSON response containing the calendar details.
    ::raises ValidationError : Raised if the provided data is invalid.
    """
    try:
        title = request.data.get('title', 'My Calendar')
        description = request.data.get('description', '')
        # shared_users_emails = request.data.get('email_list', [])
        # logger.debug(f"Received shared user list: {shared_users_emails}")
        
        # Create the calendar instance
        calendar = Calendar.objects.create(user=request.user, title=title, description=description)        
        
        logger.debug(f"Created new calendar for user {request.user.id}")

        serializer = CalendarSerializer(calendar)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.exception("Error creating calendar")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)