from django.urls import path
from .views import run_migrations, create_superuser

urlpatterns = [
    path('run-migrations/', run_migrations, name='run_migrations'),
    path('create-superuser/', create_superuser, name='create_superuser'),
]
