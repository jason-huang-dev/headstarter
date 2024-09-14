import random
from datetime import datetime
from io import BytesIO
from typing import List
from dateutil import parser
from pytz import UTC
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from icalendar import Calendar as ICalendar, Event as ICalEvent

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from events.models import Event
from .models import Calendar
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from .serializers import CalendarSerializer
from invitations.models import CalendarInvite
from invitations.serializers import CalendarInviteSerializer
from django.utils.dateparse import parse_datetime
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Function to generate random colors, avoiding very light colors
def generate_random_color():
    # Generate RGB values between 0 and 200 to avoid light colors (values near 255 are too white)
    r = random.randint(0, 240)
    g = random.randint(0, 240)
    b = random.randint(0, 240)
    # Convert RGB to HEX format
    return f"#{r:02x}{g:02x}{b:02x}"

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def calendar_view(request):
    """
    Manage all calendars in the data base for the authenticated user

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
    Retrieve all calendars for the user.

    ::param HTTPRequest request : The HTTP request object
    ::return Response : A JSON response containing all the calendars related to the user
    ::raises ValidationError : Raised if the provided data is invalid
    """
    try:
        calendars = Calendar.objects.filter(user=request.user)
        serializer = CalendarSerializer(calendars, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error retrieving calendars")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def create_calendar(request):
    """
    Create a new calendar for the authenticated user and invite specified users to it.

    :param HTTPRequest request: The HTTP request object
    :return Response: A JSON response with the created calendar's details and invitations
    """
    try:
        title = request.data.get('title', 'My Calendar')
        description = request.data.get('description', '')
        emails = request.data.get('email_list', [])  # Get the list of emails

        # Create the calendar
        calendar = Calendar.objects.create(user=request.user, title=title, description=description)

        # Process email invitations using the extracted function
        invitations, email_statuses = process_email_invitations(calendar, emails, request.user)

        # Serialize and return the calendar data and invitations
        calendar_serializer = CalendarSerializer(calendar)
        invite_serializer = CalendarInviteSerializer(invitations, many=True)

        return Response({
            'calendar': calendar_serializer.data,
            'invitations': invite_serializer.data,
            'email_statuses': email_statuses
        }, status=status.HTTP_201_CREATED)
    
    except ValidationError as e:
        logger.exception("Validation error")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.exception("Error creating calendar")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def calendar_detailed_view(request, cal_id=None):
    """
    Manage individual calendars for the authenticated user given a cal_id

    ::param HTTPRequest request : The HTTP request object
    ::param int cal_id : The ID of the calendar (only used for PUT and DELETE methods)
    ::return JSON : a JSON response with the calendar data or an error message

    - @GET: Retrieve a calendar based on cal_id.
    - @PUT: Update an existing calendar for the user based on cal_id.
    - @DELETE: Delete an existing calendar for the user based on cal_id.
    """
    if not cal_id:
        return Response({'error': 'cal_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        return get_calendar(request, cal_id)
    elif request.method == 'PUT':
        return update_calendar(request, cal_id)
    elif request.method == 'DELETE':
        return delete_calendar(request, cal_id)

def get_calendar(request, cal_id):
    """
    Retrieve all calendars for the user.

    ::param HTTPRequest request : The HTTP request object
    ::return Response : A JSON response containing all the calendars related to the user
    ::raises ValidationError : Raised if the provided data is invalid
    """
    try:
        calendars = get_object_or_404(Calendar, cal_id=cal_id)
        serializer = CalendarSerializer(calendars, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error retrieving calendars")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def update_calendar(request, cal_id):
    """
    Update an existing calendar for the authenticated user and send invitation emails.

    :param HTTPRequest request: The HTTP request object
    :param int cal_id: The ID of the calendar to update
    :return Response: A JSON response with the updated calendar details or an error message
    """
    logger.debug('Request data: %s', request.data)
    try:
        title = request.data.get('title')
        description = request.data.get('description', '')
        emails = request.data.get('email_list', [])  # Get the list of emails for invitations
        
        # Fetch the calendar or return a 404 response
        calendar = get_object_or_404(Calendar, pk=cal_id, user=request.user)

        # Update the calendar fields if provided
        if title:
            calendar.title = title
        if description is not None:
            calendar.description = description
        
        # Save the updated calendar
        calendar.save()

        # Process email invitations using the extracted function
        invitations, email_statuses = process_email_invitations(calendar, emails, request.user)
        
        # Serialize and return the updated calendar data and invitations
        serializer = CalendarSerializer(calendar)
        invite_serializer = CalendarInviteSerializer(invitations, many=True)
        
        return Response({
            'calendar': serializer.data, 
            'invitations': invite_serializer.data,
            'email_statuses': email_statuses
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.exception("Error updating calendar")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def delete_calendar(request, cal_id):
    """
    Delete an existing calendar for the authenticated user, but prevent deletion if it's the only calendar.

    ::param HTTPRequest request : The HTTP request object
    ::param int cal_id : The ID of the calendar to delete
    ::return Response : A JSON response indicating success or an error message
    """
    try:
        # Get the calendar to be deleted
        calendar = get_object_or_404(Calendar, pk=cal_id, user=request.user)

        # Check if it's the only calendar
        if Calendar.objects.filter(user=request.user).count() == 1:
            return Response({'error': 'Cannot delete the last calendar'}, status=status.HTTP_400_BAD_REQUEST)

        # Proceed with deletion
        calendar.delete()
        return Response({'success': 'Calendar deleted'}, status=status.HTTP_200_OK)

    except Calendar.DoesNotExist:
        return Response({'error': 'Calendar not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error deleting calendar")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_shared_calendars(request):
    """
    Retrieve all shared calendars for the authenticated user.

    ::param HTTPRequest request : The HTTP request object
    ::return Response : A JSON response containing all the shared calendars for the user
    """
    try:
        shared_calendars = Calendar.objects.filter(shared_users=request.user)
        serializer = CalendarSerializer(shared_calendars, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error retrieving shared calendars")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def process_email_invitations(calendar, emails: List[str], user):
    """
    Process email invitations for a calendar.

    :param Calendar calendar: The calendar for which invitations are sent
    :param list emails: A list of email addresses to invite
    :param User user: The user who is sending the invitations
    :return tuple: A tuple containing the list of CalendarInvite objects and the email statuses
    """
    invitations = []
    email_statuses = []
    emails = [email.lower() for email in emails]
    for email in emails:
        if email:
            # Check if the email is already invited
            if CalendarInvite.objects.filter(calendar=calendar, email=email).exists():
                continue  # Skip if already invited

            # Create an invitation
            invite = CalendarInvite.objects.create(
                calendar=calendar,
                email=email,
                invited_by=user,
                token=get_random_string(32)  # Generate a unique token
            )
            
            # Prepare and send email
            subject = f"You've been invited to the calendar: {calendar.title}"
            context = {
                'calendar_name': calendar.title,
                'invited_by': user.username,
                'current_year': datetime.now().year
            }
            html_message = render_to_string('emails/invitation_email.html', context)
            email_message = EmailMessage(
                subject=subject,
                body=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email]
            )
            email_message.content_subtype = "html"  # Set email content to HTML
            
            # Send the email and track the status
            try:
                email_success = email_message.send()
                email_statuses.append({'email': email, 'success': email_success})
            except Exception as email_error:
                logger.exception(f"Failed to send email to {email}")
                email_statuses.append({'email': email, 'success': False, 'error': str(email_error)})

            invitations.append(invite)
    
    return invitations, email_statuses

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_ics_calendar(request):
    """
    Import calendar data from an uploaded .ics file.
    """
    file = request.FILES.get('ics_file')
    if not file:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        title = request.data.get('title', 'My Calendar')
        description = request.data.get('description', '')
        emails = request.data.get('email_list', [])  # Get the list of emails

        # Create the calendar
        calendar = Calendar.objects.create(user=request.user, title=title, description=description)
        # Read and parse the ICS file
        ics_data = file.read()
        calendar_ics = ICalendar.from_ical(ics_data)

        # Dictionary to store event summaries and their associated colors
        color_map = {}

        # Process calendar data
        for component in calendar_ics.walk():
            if component.name == "VEVENT":
                summary = component.get('SUMMARY', 'No Title')
                description = component.get('DESCRIPTION', '')
                start = component.get('DTSTART').dt
                end = component.get('DTEND').dt
                #logger.info("Summary: %s \nDescription: %s \nStart: %s \nEnd: %s \n", summary, description, start, end)

                # Check if the summary already has a color, if not generate one
                if summary not in color_map:
                    color_map[summary] = generate_random_color()

                # Save or update the calendar events in your database
                Event.objects.create(
                    cal_id=calendar,
                    title=summary,
                    description=description,
                    start=start,
                    end=end,
                    user=request.user,
                    bg_color=color_map[summary]
                )

        return Response({'success': 'File imported successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_ics_calendar(request):
    """
    Export calendar data as a .ics file.
    """
    try:
        # Get calendar title and events from the request
        calendar_title = request.data.get("cal_title", "My Calendar")
        events = request.data.get("events", [])
        logger.info("%s", events)

        # Create an ICS calendar
        ics_calendar = ICalendar()
        ics_calendar.add('prodid', '-//My Calendar Application//EN')
        ics_calendar.add('version', '2.0')
        ics_calendar.add('x-wr-calname', calendar_title)

        # Add events to the ICS calendar
        for event_data in events:
            try:
                ics_event = ICalEvent()
                ics_event.add('SUMMARY', event_data['title'])
                ics_event.add('DESCRIPTION', event_data.get('description', ''))

                # Convert start and end to datetime using dateutil parser
                start = parser.isoparse(event_data['start']) if isinstance(event_data['start'], str) else event_data['start']
                end = parser.isoparse(event_data['end']) if isinstance(event_data['end'], str) else event_data['end']

                # Convert to UTC .ics format if needed (DTSTART and DTEND for UTC)
                start_utc = start.astimezone(UTC)
                end_utc = end.astimezone(UTC)

                # Add the event to the calendar using datetime objects
                ics_event.add('DTSTART', start_utc)
                ics_event.add('DTEND', end_utc)

                # Add the event to the calendar
                ics_calendar.add_component(ics_event)
            except KeyError as key_err:
                logger.error(f"Missing required field in event: {key_err}")
                return HttpResponse({'error': f"Missing required field in event: {key_err}"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error(f"Error processing event: {e}")
                return HttpResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save calendar to a BytesIO stream
        ics_file = BytesIO()
        ics_file.write(ics_calendar.to_ical())
        ics_file.seek(0)
        raw_ics_data = ics_file.getvalue()
        # logger.info("ICS Data: %s", raw_ics_data.decode('utf-8'))

        # Prepare the response with the correct content type
        response = HttpResponse(raw_ics_data, content_type='text/calendar')
        response['Content-Disposition'] = 'attachment; filename="calendar.ics"'

        return response
    except Exception as e:
        logger.error(f"Error generating ICS calendar: {str(e)}", exc_info=True)  # Detailed logging with stack trace
        return HttpResponse({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
