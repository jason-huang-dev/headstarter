"""
File: settings.py
Author: Ester
Documentation updated by: Jason
Date: 2024-08-09

This file contains configuration settings for the Django project, including
database setup, middleware, installed apps, authentication backends, and
other project-specific settings.
    
Note:
    - Remember to set up environment variables for sensitive information.
    - The default profile picture path and other static/media settings can
      be adjusted according to your project's needs.
"""

import os
from pathlib import Path
from datetime import timedelta
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'users.apps.UsersConfig',
    'calendars.apps.CalendarConfig',
    'events.apps.EventsConfig',
    'invitations.apps.InvitationsConfig',
    'whitenoise.runserver_nostatic',
    'ai.apps.AIConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'calendar_app.urls'

WSGI_APPLICATION = 'calendar_app.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': dj_database_url.config(default=os.getenv('POSTGRES_DB_URL'))
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SITE_ID = 1

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Disable email verification since we're using Google OAuth
ACCOUNT_EMAIL_VERIFICATION = 'none'

# Use email as the username field
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'

# Add your Google OAuth client ID and secret
SOCIALACCOUNT_PROVIDERS['google']['APP'] = {
    'client_id': os.getenv('VITE_GOOGLE_OAUTH_ID'),
    'secret': os.getenv('VITE_GOOGLE_OAUTH_SECRET'),
    'key': ''
}

AUTH_USER_MODEL = 'users.CustomUser'

# dj-rest-auth settings
REST_AUTH = {
    'USER_DETAILS_SERIALIZER': 'users.serializers.CustomUserDetailsSerializer',
    'LOGIN_SERIALIZER': 'dj_rest_auth.serializers.LoginSerializer',
    'TOKEN_MODEL': 'rest_framework.authtoken.models.Token',
}

# Additional AllAuth settings
ACCOUNT_UNIQUE_EMAIL = True

if os.getenv('DEV_MODE') == 'true':
    CORS_ALLOW_ALL_ORIGINS = True
else:
    ALLOWED_HOSTS = ['timemesh-backend.vercel.app', 'timemesh-backend.vercel.app/admin',]
    CORS_ALLOWED_ORIGINS = [
    "https://timemesh-rr1s.onrender.com", 
    "https://timemesh.vercel.app", 
    "https://timemesh-backend.vercel.app/admin",
    "https://openrouter.ai/api/v1/chat/completions",
    ]
    CSRF_TRUSTED_ORIGINS = [
    "https://timemesh-rr1s.onrender.com", "https://timemesh.vercel.app", "https://timemesh-backend.vercel.app/admin", "https://openrouter.ai/api/v1/chat/completions",
    ]
CORS_ALLOW_CREDENTIALS = True

# Base dir of your project
BASE_DIR = Path(__file__).resolve().parent.parent

# Media files (uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default profile picture
DEFAULT_PROFILE_PIC = os.path.join(MEDIA_ROOT, 'image/default_profile.jpg')

# Setup for sending emails
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # Replace with your SMTP server address
EMAIL_PORT = 587  # Or the port number your SMTP server uses
EMAIL_USE_TLS = True  # Use TLS (True for most servers, False if you use SSL)
EMAIL_USE_SSL = False  # Use SSL (True if EMAIL_USE_TLS is False)
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')  # Your email address
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD') # Your email account password
DEFAULT_FROM_EMAIL = 'TimeMesh <'+EMAIL_HOST_USER+'>'  # Default from email address

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],  # Path to your project-level templates directory
        'APP_DIRS': True,  # Automatically discover templates in app directories
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]