from django.db import models
from django.conf import settings

class Skills(models.Model):
    name=models.CharField(max_length=20)
    is_public=models.BooleanField(default='False')

    class Meta:
        verbose_name = "Skill"     
        verbose_name_plural = "Skills" 

    def __str__(self):
        return self.name


class Education(models.Model):
    school=models.CharField(max_length=80)
    degree=models.CharField(max_length=30)
    start_date=models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_public=models.BooleanField(default='False')

    class Meta:
        verbose_name = "Education"     
        verbose_name_plural = "Education Entries"  

    def __str__(self):
        return self.degree

class Experience(models.Model):
    work_name=models.CharField(max_length=80)
    job=models.CharField(max_length=30)
    start_date=models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_public=models.BooleanField(default='False')
    class Meta:
        verbose_name = "Experience"     
        verbose_name_plural = "Experience Entries" 

    def __str__(self):
        return self.work_name