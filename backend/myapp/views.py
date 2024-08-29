from django.apps import apps
from django.http import HttpResponse
from django.core.management import call_command
from django.contrib.auth import get_user_model

def run_migrations(request):
    try:
        call_command('makemigrations')
        call_command('migrate')
        return HttpResponse("Migrations completed successfully.")
    except Exception as e:
        return HttpResponse(f"An error occurred: {e}")

def create_superuser(request):
    User = get_user_model()
    email = 'timemeshapp@gmail.com'  # Set your desired email
    username = 'TimeMesh'  # Set your desired username
    password = 'zf304W5M9y`5'  # Set your desired password

    try:
        # Delete existing user with the same username or email
        User.objects.filter(email=email).delete()
        User.objects.filter(username=username).delete()

        # Create the superuser
        User.objects.create_superuser(email=email, username=username, password=password)
        
        return HttpResponse("Superuser created successfully.")
    except Exception as e:
        return HttpResponse(f"An error occurred: {e}")
