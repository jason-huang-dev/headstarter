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

    ::param str title : The title of the calendar
    ::param str/optional description : An optional description of the calendar
    ::param list emails : A list of email addresses to invite to the calendar
    ::return Response : A JSON response with the created calendar's details and invitations
    ::raises ValidationError : Raised if the provided data is invalid
    """
    try:
        title = request.data.get('title', 'My Calendar')
        description = request.data.get('description', '')
        emails = request.data.get('email_list', [])  # Get the list of emails

        # Create the calendar
        calendar = Calendar.objects.create(user=request.user, title=title, description=description)

        # Process each email
        invitations = []
        for email in emails:
            if email:
                    # # Retrieve the user by email
                    # user = settings.AUTH_USER_MODEL.objects.get_or_create(email=email)
                    
                    # Check if the user is already invited
                    if CalendarInvite.objects.filter(calendar=calendar, email=email).exists():
                        continue  # Skip if already invited
                    
                    # Create an invitation for the user
                    invite = CalendarInvite.objects.create(
                        calendar=calendar,
                        email=email,
                        invited_by=request.user,
                        token=get_random_string(32)  # Generate a unique token
                    )
                    invitations.append(invite)
        
        # Serialize and return the calendar data and invitations
        calendar_serializer = CalendarSerializer(calendar)
        invite_serializer = CalendarInviteSerializer(invitations, many=True)
        
        ##TODO decide on if this response should return both calendar and invitations or just calendar
        return Response({
            'calendar': calendar_serializer.data, 
            'invitations': invite_serializer.data,
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
        return 
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
        calendars = get_object_or_404(Calendar, pk=cal_id, user=request.user)
        serializer = CalendarSerializer(calendars, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Error retrieving calendars")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def update_calendar(request, cal_id):
    """
    Update an existing calendar for the authenticated user.

    ::param HTTPRequest request : The HTTP request object
    ::param int cal_id : The ID of the calendar to update
    ::return Response : A JSON response with the updated calendar details or an error message
    """
    logger.debug('Request data: %s', request.data)
    try:
        title = request.data.get('title')
        description = request.data.get('description', '')
        calendar = get_object_or_404(Calendar, pk=cal_id, user=request.user)

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

def delete_calendar(request, cal_id):
    """
    Delete an existing calendar for the authenticated user.

    ::param HTTPRequest request : The HTTP request object
    ::param int cal_id : The ID of the calendar to delete
    ::return Response : A JSON response indicating success or an error message
    """
    try:
        calendar = get_object_or_404(Calendar, pk=cal_id, user=request.user)
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