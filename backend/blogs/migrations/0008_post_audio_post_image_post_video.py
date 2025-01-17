# Generated by Django 5.0.7 on 2024-08-19 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0007_alter_post_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='audio',
            field=models.FileField(blank=True, null=True, upload_to='audios/'),
        ),
        migrations.AddField(
            model_name='post',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AddField(
            model_name='post',
            name='video',
            field=models.FileField(blank=True, null=True, upload_to='videos/'),
        ),
    ]
