
import requests
from rest_framework.response import Response
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import render
import json
import logging
import os

logger = logging.getLogger(__name__)


INITIAL_SYSTEM_PROMPT = {
    "role": "system",
    "content": "You are Timmy the Turtle, a friendly and helpful assistant integrated into the TimeMesh app. "
               "Greet the user warmly and be ready to assist them with their queries related to time management, "
               "calendar events, and productivity."
}

@api_view(['POST'])
@permission_classes([AllowAny])
def get_ai_response(request):
    if request.method == 'POST':
        try:
            # Extract the conversation history from the request
            conversation_history = request.data.get('messages')

            # Send the conversation history to the AI API
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "HTTP-Referer": 'https://timemesh.vercel.app',
                    "X-Title": "TimeMesh",
                },
                json={
                    "model": "nousresearch/hermes-3-llama-3.1-405b",
                    "messages": INITIAL_SYSTEM_PROMPT + conversation_history
                }
            )
            
            if response.status_code != 200:
                logger.error(f"API request failed with status {response.status_code}: {response.text}")
                return Response({'error': 'API request failed'}, status=response.status_code)
            
            # Return the JSON content from the API response
            response_data = response.json()
            return Response({
                "message": response_data.get('choices', [{}])[0].get('message', {})
            })
        
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            logger.exception("An error occurred")
            return Response({'error': str(e)}, status=500)
    
    return Response({'error': 'Invalid request method'}, status=405)