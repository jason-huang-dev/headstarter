from datetime import datetime
from django.template.loader import render_to_string
from django.core.mail import EmailMessage

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Calendar
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from .serializers import CalendarSerializer
from invitations.models import CalendarInvite
from invitations.serializers import CalendarInviteSerializer
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

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

def process_email_invitations(calendar, emails, user):
    """
    Process email invitations for a calendar.

    :param Calendar calendar: The calendar for which invitations are sent
    :param list emails: A list of email addresses to invite
    :param User user: The user who is sending the invitations
    :return tuple: A tuple containing the list of CalendarInvite objects and the email statuses
    """
    invitations = []
    email_statuses = []
    
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