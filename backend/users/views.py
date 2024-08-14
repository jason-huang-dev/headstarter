"""
views.py

Author: Ester
Documentation updated by: Jason
Date: 2024-08-10

This module contains a Django view for authenticating users via Google OAuth2.
"""
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from django.db import IntegrityError
from allauth.socialaccount.models import SocialAccount
from rest_framework.authtoken.models import Token
from calendars.models import Calendar
import requests
from django.core.files.base import ContentFile

import logging
logger = logging.getLogger(__name__)

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Authenticate a user using a Google OAuth2 token. Create or update a user based on the token information.

    ::param JSON request:
    ```python
    {
     "token" : str - The OAuth2 token received from Google, sent in the request body.
    }
    ```
    ::return Response : A JSON response containing the authentication token, user ID, email, username, and profile picture URL.
    ::raises ValueError : Raised if the token is invalid or cannot be verified.
    ::raises IntegrityError : Raised if there is an issue creating or updating the user in the database.
    ::raises Exception : Catches any other unexpected errors and logs them.
    """
    token = request.data.get('token')
    if not token:
        return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(),  # Use google_requests.Request() here
            settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
        )

        # Extract email, name, and picture from the ID token
        email = idinfo['email']
        name = idinfo.get('name', '')
        picture_url = idinfo.get('picture')

        # Try to get an existing user with this email
        user = User.objects.filter(email=email).first()

        if user:
            # Update the existing user's name if it's different
            if user.username != name:
                user.username = name
                user.save()
        else:
            # Create a new user
            user = User.objects.create(email=email, username=name)
            Calendar.objects.create(user=user, title="Default", description="Default Calendar")
            user.set_unusable_password()
            user.save()

        # Handle profile picture
        if picture_url:
            response = requests.get(picture_url)
            if response.status_code == 200:
                img_name = f"profile_{user.id}.jpg"
                user.profile_picture.save(img_name, ContentFile(response.content), save=True)

        # Create or update social account
        social_account, created = SocialAccount.objects.get_or_create(
            provider='google',
            uid=idinfo['sub'],
            user=user
        )

        # Generate or get auth token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'picture': request.build_absolute_uri(user.profile_picture.url)
        })

    except ValueError as e:
        logger.error(f"ValueError: {str(e)}")
        return Response({'error': f'Invalid token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    except IntegrityError as e:
        logger.error(f"IntegrityError: {str(e)}")
        return Response({'error': f'User creation failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)