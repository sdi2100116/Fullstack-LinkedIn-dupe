# Generated by Django 5.0.7 on 2024-08-16 12:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_profile_nickname'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='nickname',
        ),
    ]