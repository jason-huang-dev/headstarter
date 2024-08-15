"""
File: views.py
Author: Jason
Documentation updated by: Jason
Date: 2024-08-15

This module contains a Django view for creating a new calendar under a passed user object
"""
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Calendar
from .serializers import CalendarSerializer
import logging
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

class CalendarView(APIView):
    """
    Allows authenticated users to perform CRUD operations on their calendars.

    ::param HTTPRequest request : The HTTP request object
    ::param int calendar_id : The ID of the calendar (for PUT and DELETE requests)
    ::return Response : JSON response with calendar data or error message
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, calendar_id=None):
        """
        Retrieve calendars.

        ::param HTTPRequest request : The HTTP request object
        ::param int calendar_id : The ID of the calendar to retrieve (optional)
        ::return Response : A JSON response with the calendar data or an error message
        """
        if calendar_id:
            return self.get_calendar(request, calendar_id)
        return self.get_calendars(request)

    def post(self, request):
        """
        Create a new calendar.

        ::param HTTPRequest request : The HTTP request object with calendar data
        ::return Response : A JSON response with the created calendar's details or an error message
        """
        return self.create_calendar(request)

    def put(self, request, calendar_id):
        """
        Update an existing calendar.

        ::param HTTPRequest request : The HTTP request object with updated calendar data
        ::param int calendar_id : The ID of the calendar to update
        ::return Response : A JSON response with the updated calendar details or an error message
        """
        return self.update_calendar(request, calendar_id)

    def delete(self, request, calendar_id):
        """
        Delete an existing calendar.

        ::param HTTPRequest request : The HTTP request object
        ::param int calendar_id : The ID of the calendar to delete
        ::return Response : A JSON response indicating success or an error message
        """
        return self.delete_calendar(request, calendar_id)

    def get_calendars(self, request):
        """
        Retrieve all calendars for the authenticated user.

        ::param HTTPRequest request : The HTTP request object
        ::return Response : A JSON response containing all the calendars related to the user
        """
        try:
            calendars = Calendar.objects.filter(user=request.user)
            serializer = CalendarSerializer(calendars, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Error retrieving calendars")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_calendar(self, request, calendar_id):
        """
        Retrieve a specific calendar by ID.

        ::param HTTPRequest request : The HTTP request object
        ::param int calendar_id : The ID of the calendar to retrieve
        ::return Response : A JSON response with the calendar data or an error message
        """
        try:
            calendar = get_object_or_404(Calendar, pk=calendar_id, user=request.user)
            serializer = CalendarSerializer(calendar)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Calendar.DoesNotExist:
            return Response({'error': 'Calendar not found'}, status=status.HTTP_404_NOT_FOUND)

    def create_calendar(self, request):
        """
        Create a new calendar for the authenticated user.

        ::param HTTPRequest request : The HTTP request object with calendar data
        ::return Response : A JSON response with the created calendar's details or an error message
        """
        logger.debug('Request data: %s', request.data)
        try:
            title = request.data.get('title', 'My Calendar')
            description = request.data.get('description', '')
            calendar = Calendar.objects.create(user=request.user, title=title, description=description)
            serializer = CalendarSerializer(calendar)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception("Error creating calendar")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update_calendar(self, request, calendar_id):
        """
        Update an existing calendar.

        ::param HTTPRequest request : The HTTP request object with updated calendar data
        ::param int calendar_id : The ID of the calendar to update
        ::return Response : A JSON response with the updated calendar details or an error message
        """
        logger.debug('Request data: %s', request.data)
        try:
            title = request.data.get('title')
            description = request.data.get('description', '')
            calendar = get_object_or_404(Calendar, pk=calendar_id, user=request.user)

            if title:
                calendar.title = title
            if description is not None:
                calendar.description = description

            calendar.save()
            serializer = CalendarSerializer(calendar)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Calendar.DoesNotExist:
            return Response({'error': 'Calendar not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.exception("Error updating calendar")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete_calendar(self, request, calendar_id):
        """
        Delete an existing calendar.

        ::param HTTPRequest request : The HTTP request object
        ::param int calendar_id : The ID of the calendar to delete
        ::return Response : A JSON response indicating success or an error message
        """
        try:
            calendar = get_object_or_404(Calendar, pk=calendar_id, user=request.user)
            calendar.delete()
            return Response({'success': 'Calendar deleted'}, status=status.HTTP_200_OK)

        except Calendar.DoesNotExist:
            return Response({'error': 'Calendar not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.exception("Error deleting calendar")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

