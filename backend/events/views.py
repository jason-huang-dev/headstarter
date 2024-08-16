from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Event
from .serializers import EventSerializer
from calendars.models import Calendar
from django.shortcuts import get_object_or_404
import logging

logger = logging.getLogger(__name__)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def event_view(request):
    """
    Manage events for the authenticated user

    ::param HTTPRequest request : The HTTP request object
    ::return JSON : a JSON response with the event data or an error message

    - @GET: Retrieve all events for the user.
    - @POST: Create a new event for the user.
    """
    if request.method == 'GET':
        return get_events(request)
    elif request.method == 'POST':
        return create_event(request)

def get_events(request):
    """
    Retrieve all events for the user.

    ::param HTTPRequest request : The HTTP request object
    ::return Response : A JSON response containing all the events related to the user
    ::raises ValidationError : Raised if the provided data is invalid
    """
    try:
        events = Event.objects.filter(user=request.user)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error retrieving events")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def create_event(request):
    """
    Create a new event in a calendar.

    ::param int calendar_id : The ID of the calendar to which the event will be added
    ::param str title : The title of the event
    ::param str/optional description : A description of the event
    ::param datetime start : The start date and time of the event
    ::param datetime end : The end date and time of the event
    ::param str/optional bg_color : The background color for the event in hexadecimal format (default: '#FFFFFF')
    ::return Response : A JSON response with the created event's details
    ::raises ValidationError : Raised if the provided data is invalid
    ::raises NotFound : Raised if the specified calendar does not exist
    """
    logger.debug('Request data: %s', request.data)

    cal_id = request.data.get('cal_id')
    title = request.data.get('title')
    description = request.data.get('description', '')
    start = request.data.get('start')
    end = request.data.get('end')
    bg_color = request.data.get('color', '#FFFFFF')

    if not (cal_id, title, start, end):
        return Response({'error': 'cal_id, title, start, and end are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        calendar = get_object_or_404(Calendar, pk=cal_id)
        event = Event.objects.create(
            cal_id=calendar,
            title=title,
            description=description,
            start=start,
            end=end,
            bg_color=bg_color,
            user=request.user
        )

        return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)

    except Calendar.DoesNotExist:
        return Response({'error': 'Calendar not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error creating event")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def event_detailed_view(request, event_id=None):
    """
    Manage events for the authenticated user

    ::param HTTPRequest request : The HTTP request object
    ::param int event_id : The ID of the event (only used for PUT and DELETE methods)
    ::return JSON : a JSON response with the event data or an error message

    - @GET: Retrieve all events for the user.
    - @PUT: Update an existing event for the user.
    - @DELETE: Delete an existing event for the user.
    """
    if not event_id:
        return Response({'error': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        return get_event(request, event_id)
    elif request.method == 'PUT':
        return update_event(request, event_id)
    elif request.method == 'DELETE':
        return delete_event(request, event_id)
    
def get_event(request, event_id):
    """
    Retrieve an event for the user based on event_id

    ::param HTTPRequest request : The HTTP request object
    ::return Response : A JSON response containing all the events related to the user
    ::raises ValidationError : Raised if the provided data is invalid
    """
    try:
        event = get_object_or_404(Event, pk=event_id, user=request.user)
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error retrieving events")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def update_event(request, event_id):
    """
    Update an existing event for the authenticated user.

    ::param HTTPRequest request : The HTTP request object
    ::param int event_id : The ID of the event to update
    ::return Response : A JSON response with the updated event details or an error message
    """
    logger.debug('Request data: %s', request.data)

    title = request.data.get('title')
    description = request.data.get('description', '')
    start = request.data.get('start')
    end = request.data.get('end')
    bg_color = request.data.get('color', '#FFFFFF')

    try:
        event = get_object_or_404(Event, pk=event_id, user=request.user)

        if title:
            event.title = title
        if description is not None:
            event.description = description
        if start:
            event.start = start
        if end:
            event.end = end
        if bg_color:
            event.bg_color = bg_color
        
        event.save()
        return Response(EventSerializer(event).data, status=status.HTTP_200_OK)

    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error updating event")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def delete_event(request, event_id):
    """
    Delete an existing event for the authenticated user.

    ::param HTTPRequest request : The HTTP request object
    ::param int event_id : The ID of the event to delete
    ::return Response : A JSON response indicating success or an error message
    """
    try:
        event = get_object_or_404(Event, pk=event_id, user=request.user)
        event.delete()
        return Response({'success': 'Event deleted'}, status=status.HTTP_200_OK)

    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error deleting event")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
