# Generated by Django 5.1 on 2024-08-14 17:17

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendars', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='calendar',
            name='shared_users',
            field=models.ManyToManyField(blank=True, related_name='shared_calendars', to=settings.AUTH_USER_MODEL),
        ),
    ]
