# Generated by Django 5.0.7 on 2024-08-16 12:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_profile_first_name_alter_profile_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='nickname',
            field=models.CharField(default='', max_length=30),
        ),
    ]