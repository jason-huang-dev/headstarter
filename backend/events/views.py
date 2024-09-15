from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Event
from .serializers import EventSerializer
from calendars.models import Calendar
from django.shortcuts import get_object_or_404
import logging
from datetime import datetime, timedelta
from django.utils import timezone
from django.utils.dateparse import parse_datetime, parse_date

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

def generate_repeated_dates(event):
    # logger.info("Start of generate repeated dates")
    start_date = event.start
    repeat_until = event.repeat_until or (start_date + timedelta(days=365))  # Default to 1 year from start

    # Ensure both start_date and repeat_until are timezone-aware
    if timezone.is_naive(start_date):
        start_date = timezone.make_aware(start_date)
    if timezone.is_naive(repeat_until):
        repeat_until = timezone.make_aware(repeat_until)

    repeated_dates = []
    current_date = start_date

    # Limit the number of repeated dates to prevent excessive generation
    max_repetitions = 100
    loop_counter = 0

    while current_date <= repeat_until and len(repeated_dates) < max_repetitions:
        # logger.info("In while loop - current date: %s", current_date)
        loop_counter += 1
        if event.repeat_type == 'DAILY':
            repeated_dates.append(current_date)
            current_date += timedelta(days=1)
        elif event.repeat_type == 'WEEKLY':
            if event.repeat_days:
                weekdays = [{'MON': 0, 'TUE': 1, 'WED': 2, 'THU': 3, 'FRI': 4, 'SAT': 5, 'SUN': 6}[day] for day in event.repeat_days]
                if current_date.weekday() in weekdays:
                    repeated_dates.append(current_date)
                current_date += timedelta(days=1)
            else:
                repeated_dates.append(current_date)
                current_date += timedelta(weeks=1)
        elif event.repeat_type == 'MONTHLY':
            repeated_dates.append(current_date)
            next_month = (current_date.month % 12) + 1
            year_increment = (current_date.month + 1) // 13
            current_date = current_date.replace(year=current_date.year + year_increment, month=next_month)
        elif event.repeat_type == 'YEARLY':
            repeated_dates.append(current_date)
            current_date = current_date.replace(year=current_date.year + 1)
        elif event.repeat_type == "NONE":
            break
            
        # Failsafe in case of an endless loop scenario
        if loop_counter > max_repetitions:
            logger.warning("Exceeded max repetition count: %d", max_repetitions)
            break
    
    # Filter out the original start date
    repeated_dates = [date for date in repeated_dates if date != start_date]
    # logger.info("End of generate repeated dates")
    return repeated_dates

def get_events(request):
    try:
        owned_calendars = Calendar.objects.filter(user=request.user)
        shared_calendars = Calendar.objects.filter(shared_users=request.user)
        all_calendars = owned_calendars | shared_calendars

        start_date = request.GET.get('start')
        end_date = request.GET.get('end')

        all_events = []

        if start_date and end_date:
            start_date = timezone.make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
            end_date = timezone.make_aware(datetime.strptime(end_date, '%Y-%m-%d')) + timedelta(days=1)  # Include the full end date

            events = Event.objects.filter(cal_id__in=all_calendars, start__lt=end_date, end__gte=start_date)

            for event in events:
                event_data = EventSerializer(event).data

                if event.repeat_type != 'NONE':
                    repeated_dates = generate_repeated_dates(event)
                    filtered_repeated_dates = [
                        date for date in repeated_dates
                        if start_date <= date < end_date
                    ]
                    event_data['repeated_dates'] = [date.isoformat() for date in filtered_repeated_dates]

                all_events.append(event_data)

        else:
            events = Event.objects.filter(cal_id__in=all_calendars)
            for event in events:
                event_data = EventSerializer(event).data
                if event.repeat_type != 'NONE':
                    repeated_dates = generate_repeated_dates(event)
                    event_data['repeated_dates'] = [date.isoformat() for date in repeated_dates]
                all_events.append(event_data)

        return Response(all_events, status=status.HTTP_200_OK)

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
    # logger.info('Request data: %s', request.data)

    cal_id = request.data.get('cal_id')
    title = request.data.get('title')
    description = request.data.get('description', '')
    start = request.data.get('start')
    end = request.data.get('end')
    bg_color = request.data.get('color', '#FFFFFF')
    repeat_type = request.data.get('repeat_type', 'NONE')
    repeat_days = request.data.get('repeat_days') if repeat_type == 'WEEKLY' else None
    repeat_until = request.data.get('repeat_until')

    if not (cal_id and title and start and end):
        return Response({'error': 'cal_id, title, start, and end are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        calendar = get_object_or_404(Calendar, pk=cal_id)
        if repeat_until:
            repeat_until = parse_datetime(repeat_until)
            if timezone.is_naive(repeat_until):
                repeat_until = timezone.make_aware(repeat_until)
        
        start = parse_datetime(start)
        end = parse_datetime(end)
        
        # Ensure start and end are timezone-aware
        if timezone.is_naive(start):
            start = timezone.make_aware(start)
        if timezone.is_naive(end):
            end = timezone.make_aware(end)
        
        event = Event.objects.create(
            cal_id=calendar,
            title=title,
            description=description,
            start=start,
            end=end,
            bg_color=bg_color,
            user=request.user,
            repeat_type=repeat_type,
            repeat_days=repeat_days,
            repeat_until=repeat_until
        )
        
        # Generate and save repeated dates
        # logger.info('Start Event Generation: %s', event)
        repeated_dates = generate_repeated_dates(event)
        event.set_repeated_dates(repeated_dates)
        event.save()
        # logger.info('Returning respons: %s', EventSerializer(event).data)
        return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)

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
        event_data = EventSerializer(event).data
        
        if event.repeat_type != 'NONE':
            repeated_dates = generate_repeated_dates(event)
            event_data['repeated_dates'] = repeated_dates

        return Response(event_data, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error retrieving event")
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
    description = request.data.get('description')
    start = request.data.get('start')
    end = request.data.get('end')
    bg_color = request.data.get('color')
    repeat_type = request.data.get('repeat_type')
    repeat_days = request.data.get('repeat_days')
    repeat_until = request.data.get('repeat_until')

    try:
        event = get_object_or_404(Event, pk=event_id, user=request.user)

        if title:
            event.title = title
        if description is not None:
            event.description = description
        if start:
            event.start = parse_datetime(start)
        if end:
            event.end = parse_datetime(end)
        if bg_color:
            event.bg_color = bg_color
        if repeat_type:
            event.repeat_type = repeat_type
        if repeat_days is not None:
            event.repeat_days = repeat_days
        if repeat_until:
            event.repeat_until = parse_datetime(repeat_until)

        # Regenerate repeated dates if repeat-related fields have changed
        if any(field in request.data for field in ['repeat_type', 'repeat_days', 'repeat_until', 'start', 'end']):
            repeated_dates = generate_repeated_dates(event)
            event.set_repeated_dates(repeated_dates)

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