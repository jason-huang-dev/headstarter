"""
File: urls.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

URL configuration for calendar_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from users.views import google_auth, sign_out, test_connection
from django.conf import settings
from django.conf.urls.static import static

from calendars.views import calendar_view, calendar_detailed_view, get_shared_calendars, import_ics_calendar, export_ics_calendar
from events.views import event_view, event_detailed_view
from invitations.views import create_invitation, respond_invitation, get_invites_by_email
from ai.views import get_ai_response

urlpatterns = [
    path('admin/', admin.site.urls),

    ## Authorization Paths
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/social/', include('allauth.socialaccount.urls')),
    path('api/auth/google/', google_auth, name='google_auth'),
    path('api/auth/signout/', sign_out, name="google_signout"),

    ## Event Paths
    path('api/events/', event_view, name='event_view'), # Handles GET and POST for all events
    path('api/events/<int:event_id>/', event_detailed_view, name='event_detailed_view'),  # Handles PUT, DELETE, GET for individual events

    ## Calendar Paths
    path('api/calendars/', calendar_view, name='calendar_view'), # Handles GET and POST for all calendars
    path('api/calendars/<int:cal_id>/', calendar_detailed_view, name='calendar_detailed_view'),  # Handles PUT, DELETE, GET for individual calendars
    path('api/calendars/shared/', get_shared_calendars, name='get_shared_calendars'),
    path('api/calendars/import/', import_ics_calendar, name='import_calendar'), # Handles POST for calendar imports
    path('api/calendars/export/', export_ics_calendar, name='export_calendar'), # Handles GET for calendar exports

    ## Invitations Paths
    path('api/invitations/create/', create_invitation, name='create_invitation'),
    path('api/invitations/accept/', respond_invitation, name='accept_decline_invitation'),
    path('api/invitations/', get_invites_by_email, name='get_invites_by_email'),

    path('api/test', test_connection, name="test_connection"),

    # AI Path
    path('api/ai/', get_ai_response, name='get_ai_response'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)