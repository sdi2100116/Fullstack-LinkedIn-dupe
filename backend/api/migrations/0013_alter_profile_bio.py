# Generated by Django 5.0.7 on 2024-09-28 22:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_profile_bio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='bio',
            field=models.TextField(blank=True, default='no bio'),
        ),
    ]
