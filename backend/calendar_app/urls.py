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
from users.views import google_auth
from django.conf import settings
from django.conf.urls.static import static

from calendars.views import calendar_view
from events.views import event_view
from friends.views import add_friendship

urlpatterns = [
    path('admin/', admin.site.urls),

    ## Authorization Paths
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/social/', include('allauth.socialaccount.urls')),
    path('api/auth/google/', google_auth, name='google_auth'),

    ## Event Paths
    path('api/events/', event_view, name='create_view'), # Updated to handle all event actions
    path('api/events/<int:event_id>/', event_view, name='event_view'),  # Updated for PUT and DELETE

    ## Calendar Paths
    path('api/calendars/', calendar_view, name='calendar_view'),  # Updated to handle all calendar actions
    path('api/calendars/<int:calendar_id>/', calendar_view, name='calendar_view'),  # Updated for PUT and DELETE
        
    ## Friends Paths
    path('api/friends/', add_friendship, name='add_friendship'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)