
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
@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def get_ai_response(request):
    if request.method == 'POST':
        try:

            user_message = request.data.get('message', 'No message provided')

            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                    "HTTP-Referer": 'https://timemesh.vercel.app',
                    "X-Title": "TimeMesh",
                },
                json={
                    "model": "nousresearch/hermes-3-llama-3.1-405b",
                    "messages": [
                        {"role": "user", "content": user_message}
                    ]
                }
            )
            if response.status_code != 200:
                logger.error(f"API request failed with status {response.status_code}: {response.text}")
                return Response({'error': 'API request failed'}, status=response.status_code)
                
            return Response(response)
        
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            logger.exception("An error occurred")
            return Response({'error': str(e)}, status=500)
    
    return Response({'error': 'Invalid request method'}, status=405)

def show_ai_form(request):
    return render(request, 'ai_response_form.html')