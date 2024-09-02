
import requests
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json
import logging
import os

logger = logging.getLogger(__name__)
@csrf_exempt
def get_ai_response(self, request):
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
                return JsonResponse({'error': 'API request failed'}, status=response.status_code)
                
            return JsonResponse(response.json(), safe=False)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            logger.exception("An error occurred")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)
