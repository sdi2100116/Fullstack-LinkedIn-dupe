# Generated by Django 5.0.7 on 2024-08-24 21:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('api', '0011_remove_connection_is_accepted_connection_status_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ConnectionNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.BooleanField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('connection', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.connection')),
            ],
        ),
    ]
