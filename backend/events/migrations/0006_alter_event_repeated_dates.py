# Generated by Django 5.1 on 2024-09-12 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0005_alter_event_repeated_dates'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='repeated_dates',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
