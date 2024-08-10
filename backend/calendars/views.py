"""
views.py

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

    #### Parameters
    - title : str
        - The title of the calendar.
    - description : str
        - An optional description of the calendar.

    #### Returns
    - Response
        - A JSON response containing the calendar details.

    #### Raises
    - ValidationError
        - Raised if the provided data is invalid.
    """
    title = request.data.get('title')
    description = request.data.get('description', '')  # Optional field
    
    if not title:
        return Response({'error': 'Title is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        calendar = Calendar.objects.create(user=request.user, title=title, description=description)
        serializer = CalendarSerializer(calendar)
        return Response(serializer.fields, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)