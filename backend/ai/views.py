
from datetime import datetime, timedelta
from django.utils import timezone
import re
from rest_framework.response import Response
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from ai.constants import INITIAL_PROMPT_GENERAL, INITIAL_PROMPT_EVENT_GENERATION
from events.models import Event
from calendars.models import Calendar

import requests
import json
import logging
logger = logging.getLogger(__name__)


INITIAL_SYSTEM_PROMPT = lambda INITIAL_PROMPT_CONTENT: {
    "role": "system",
    "content": INITIAL_PROMPT_CONTENT
}
MAX_TOKENS = 15000  # Adjust this based on your needs and model limitations


# Array of keywords for event generation
GENERATE_EVENT_KEYWORDS = ["generate events", "create schedule", "plan events", "generate more events"]

@api_view(['POST'])
@permission_classes([AllowAny])
def get_ai_response(request):
    """
    Delegate the AI response handling based on user input.
    :param List[str] messages: List of the conversation log.
    :return: Response containing the message and updates.
    """
    if request.method == 'POST':
        try:
            # Extract conversation history from the request
            conversation_history = request.data.get('messages')
            user_message = conversation_history[-1]['content'] if conversation_history else ""

            # Delegate to the correct handler based on the last message
            if any(keyword in user_message.lower() for keyword in GENERATE_EVENT_KEYWORDS):
                return handle_event_generation(request.user, conversation_history)
            else:
                return handle_general_chat(conversation_history)
        
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            logger.exception("An error occurred")
            return Response({'error': str(e)}, status=500)
    
    return Response({'error': 'Invalid request method'}, status=405)


def handle_general_chat(conversation_history):
    """
    Handle general AI chat responses.
    :param List[dict] conversation_history: The conversation log from the user.
    :return: Response containing the message and updates.
    """
    try:
        # Send the conversation history to the general chat model
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "HTTP-Referer": 'https://timemesh.vercel.app',
                "X-Title": "TimeMesh",
            },
            json={
                "model": "nousresearch/hermes-3-llama-3.1-405b",  # Use the general chat model
                "messages": [INITIAL_SYSTEM_PROMPT(INITIAL_PROMPT_GENERAL)] + truncate_messages(conversation_history)
            }
        )

        if response.status_code != 200:
            logger.error(f"API request failed with status {response.status_code}: {response.text}")
            return Response({'error': 'API request failed'}, status=response.status_code)

        # Parse the response and format the output
        response_data = response.json()
        message = response_data.get('choices', [{}])[0].get('message', {}).get('content', "")
        updates = []

        return Response({"message": message, "update": updates})

    except Exception as e:
        logger.exception("Error during general chat handling")
        return Response({'error': str(e)}, status=500)


def handle_event_generation(user, conversation_history):
    """
    Handle event generation based on user input and user's events for next 6 months.
    :param List[dict] conversation_history: The conversation log from the user.
    :param User.model user: The user who is requesting the generation of events
    :return: Response containing the message and updates.
    """
    try:
        # Preprocess the user's last message and append to the conversation_history
        user_message = conversation_history[-1].get("content", "")
        # Get today's date and calculate the end date for the next half year
        today_date = datetime.now().strftime('%Y-%m-%d')
        # Query for relevant events from today to the next 6 months, and convert to string format
        relevant_events = Event.objects.filter(
            user=user,
            start__gte=datetime.now(),
            start__lte=datetime.now() + timedelta(days=30) # Add considers events for the coming 30 days
        )
        events_str = "\n".join(
            [f"Title: {event.title}, Start: {event.start}, End: {event.end}, "
            f"Color: {event.bg_color}, Repeat: {event.repeat_type}, Repeat Until: {event.repeat_until}"
            for event in relevant_events]
        )
        # Combine all the info and replace the user's last message with the new message
        user_message = f"Date: {today_date} \n{user_message} \n\nCurrent Events:{events_str}"
        conversation_history[-1]['content'] = user_message
        
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "HTTP-Referer": 'https://timemesh.vercel.app',
                "X-Title": "TimeMesh",
            },
            json={
                "model": "nousresearch/hermes-3-llama-3.1-405b",  # Use the event creation model
                "messages": [INITIAL_SYSTEM_PROMPT(INITIAL_PROMPT_EVENT_GENERATION)] + truncate_messages(conversation_history)
            }
        )

        if response.ok:
            # Parse the response and format the output
            response_data = response.json()
            message = response_data.get('choices', [{}])[0].get('message', {}).get('content', "")
            
            # Parse the message into JSON and generate the Events
            try:
                events_data = parse_events_from_response(message)
            except ValueError as e:
                logger.error(f"Error parsing events: {e}")
                return Response({'error': str(e)}, status=400)
            created_events = create_events_from_data(events_data, user)
            logger.info(created_events)
            if not created_events:
                return Response({"message": "There was an issue creating you events! Please try again later.",}, status=500)

            updates = ["calendars", "events"]  # Array of things to update in the frontend
            return Response({
                "message": "Your events have been successfully generated please check the calendar named \"SMART\"", 
                "update": updates
            })
        else:
            logger.error(f"API request failed with status {response.status_code}: {response.text}")
    except Exception as e:
        logger.exception("Error during event generation handling")
        return Response({'error': str(e)}, status=500)


"""
The following functions are helper funtions
"""
def truncate_messages(messages, max_tokens=MAX_TOKENS):
    total_tokens = sum(len(m['content']) for m in messages)
    while total_tokens > max_tokens:
        messages.pop(0)  # Remove the oldest message
        total_tokens = sum(len(m['content']) for m in messages)
    return messages


def parse_events_from_response(message):
    """
    Parse the events from the AI response message.
    :param str message: The AI response message containing the events.
    :return: List of event data dictionaries.
    :raises ValueError: If the JSON data is invalid or can't be parsed.
    """
    json_match = re.search(r'Generated Events:\s*(\[.*?\])', message, re.DOTALL)
    if not json_match:
        raise ValueError("Failed to parse the event details from AI response.")
    
    json_data = json_match.group(1)

    try:
        events_data = json.loads(json_data)
    except json.JSONDecodeError as e:
        raise ValueError("Failed to decode JSON data: " + str(e))
    
    return events_data

from django.utils import timezone
from datetime import datetime

def create_events_from_data(events_data, user):
    """
    Create Event instances from parsed JSON data.
    :param list events_data: List of event data dictionaries.
    :param User.model user: The user who owns the events.
    :return: List of created Event instances.
    :raises ValueError: If the event data is invalid or incomplete.
    """
    calendar = Calendar.objects.create(user=user, title="SMART", description="")
    created_events = []

    for event in events_data:
        try:
            # Convert ISO formatted strings to datetime objects
            start = datetime.fromisoformat(event.get('start', ''))
            end = datetime.fromisoformat(event.get('end', ''))

            # Handle repeat_until, default to None if empty
            repeat_until_str = event.get('repeat_until', '')
            repeat_until = datetime.fromisoformat(repeat_until_str) if repeat_until_str else None

            # Convert naive datetimes to aware datetimes
            if timezone.is_naive(start):
                start = timezone.make_aware(start, timezone.get_current_timezone())
            if timezone.is_naive(end):
                end = timezone.make_aware(end, timezone.get_current_timezone())
            if repeat_until and timezone.is_naive(repeat_until):
                repeat_until = timezone.make_aware(repeat_until, timezone.get_current_timezone())

            new_event = Event.objects.create(
                cal_id=calendar,
                title=event.get('title', ''),
                start=start,
                end=end,
                bg_color=event.get('bg_color', '#FF776F'),
                repeat_type=event.get('repeat_type', 'NONE'),
                repeat_until=repeat_until,
                user=user
            )
            new_event.save()
            created_events.append(new_event)
        except Exception as e:
            logger.error(f"Error creating event: {e}")
            continue

    logger.info(created_events)
    return created_events
