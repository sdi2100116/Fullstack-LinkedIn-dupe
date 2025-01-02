# Generated by Django 5.0.7 on 2024-08-21 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0008_post_audio_post_image_post_video'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='audio',
            field=models.FileField(blank=True, null=True, upload_to='media/audios/'),
        ),
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='media/images/'),
        ),
        migrations.AlterField(
            model_name='post',
            name='video',
            field=models.FileField(blank=True, null=True, upload_to='media/videos/'),
        ),
    ]
