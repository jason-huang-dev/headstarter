# users/views.py

from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from allauth.socialaccount.models import SocialAccount
from django.conf import settings

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    token = request.data.get('token')
    if not token:
        return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id'])

        # Get or create user
        email = idinfo['email']
        user, created = User.objects.get_or_create(email=email)

        if created:
            user.set_unusable_password()
            user.save()

        # Create or update social account
        SocialAccount.objects.get_or_create(
            provider='google',
            uid=idinfo['sub'],
            user=user
        )

        # Generate or get auth token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

    except ValueError:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)