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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_calendar(request):
    """
    Create a new calendar for the authenticated user.

    ::param str title : The title of the calendar.
    ::param str  description : An optional description of the calendar.
    ::return Response : A JSON response containing the calendar details.
    ::raises ValidationError : Raised if the provided data is invalid.
    """
    try:# Check if user already has a calendar
        existing_calendar = Calendar.objects.filter(user=request.user).first()
        if existing_calendar:# Use the existing calendar
            calendar = existing_calendar
            created = False
            logger.info(f"Using existing calendar for user {request.user.id}")
            return Response(CalendarSerializer(calendar).data, status=status.HTTP_200_OK)
        else:# Create new calendar
            title = request.data.get('title', 'My Calendar')
            description = request.data.get('description', '')
            calendar = Calendar.objects.create(user=request.user, title=title, description=description)
            created = True
            logger.info(f"Created new calendar for user {request.user.id}")

            serializer = CalendarSerializer(calendar)
            return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error retrieving or creating calendar")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)