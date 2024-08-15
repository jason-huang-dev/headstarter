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

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def calendar_view(request):
    """
    Manage events for the authenticated user
    
    ::param HTTPRequest request : The HTTP request object
    ::return JSON : a JSON response with the calendar data or an error message

    - @GET: Retrieve all events for the user.
    - @POST: Create a new event for the user.
    - @PUT: Update an existing event for the user.
    - @DELETE: Delete an existing event for the user.
    """
    if request.method == 'GET':
        return get_events(request)
    elif request.method == 'POST':
        return create_event(request)
    elif request.method == 'PUT':
        return update_event(request)
    elif request.method == 'DELETE':
        return delete_event(request)

def get_events(request):
    """
    Retrieve all events for the user.

    ::param user.token user : The user key to filter for
    ::return Response : A JSON response containing all the calendars related to an user
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
        calendar = get_object_or_404(Calendar, cal_id=cal_id)
        event = Event.objects.create(
            calendar=calendar,
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
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def update_event(request):
    """
    Update an existing event for the authenticated user.

    ::param HTTPRequest request : The HTTP request object
    ::return JSON : a JSON response with the updated event details or an error message
    """
    logger.debug('Request data: %s', request.data)
    
    event_id = request.data.get('event_id')
    title = request.data.get('title')
    description = request.data.get('description', '')
    start = request.data.get('start')
    end = request.data.get('end')
    bg_color = request.data.get('color', '#FFFFFF')

    if not event_id:
        return Response({'error': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def delete_event(request):
    """
    Delete an existing event for the authenticated user.

    ::param HTTPRequest request : The HTTP request object
    ::return JSON : a JSON response indicating success or an error message
    """
    event_id = request.data.get('event_id')

    if not event_id:
        return Response({'error': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        event = get_object_or_404(Event, pk=event_id, user=request.user)
        event.delete()
        return Response({'success': 'Event deleted'}, status=status.HTTP_200_OK)

    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
