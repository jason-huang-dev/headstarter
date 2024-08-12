"""
views.py

Author: Jason
Documentation updated by: Jason
Date: 2024-08-10

This module contains a Django view for creating a new friendship
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Friendships
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_friendship(request):
    """
    Create a new friendship between the authenticated user and another user.

    ::param int friend_id : The ID of the user to be added as a friend.
    ::return Response : A JSON response indicating the success or failure of the operation.
    ::raises ValidationError : Raised if the friendship already exists or if an invalid user ID is provided.
    """
    friend_id = request.data.get('friend_id')

    if not friend_id:
        return Response({'error': 'No friend ID provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        friend = get_object_or_404(request.user, id=friend_id)

        # Check if the user is trying to add themselves as a friend
        if friend == request.user:
            return Response({'error': 'You cannot add yourself as a friend'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the friendship already exists
        if Friendships.objects.filter(user=request.user, friend=friend).exists():
            return Response({'error': 'Friendship already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the friendship
        Friendships.objects.create(user=request.user, friend=friend)

        return Response({'message': 'Friendship added successfully'}, status=status.HTTP_201_CREATED)

    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
