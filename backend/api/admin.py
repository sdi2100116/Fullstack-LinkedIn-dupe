from django.contrib import admin
from api.models import User,Profile,Connection
from blogs.models import Post,Comment, Interest,View
from PersonalData.models import Skills,Education,Experience
from Notifications.models import ConnectionNotification,PostNotification
from Jobs.models import Job
from chat.models import Message, Conversation
# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ['username','email']

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user','first_name','last_name','phone_number']

class PostAdmin(admin.ModelAdmin):
    list_display = ['title','created_at']

class ConnectionAdmin(admin.ModelAdmin):
    list_display=['from_user','to_user','created_at','status']

class SkillsAdmin(admin.ModelAdmin):
    list_display=['name','is_public']

class EducationAdmin(admin.ModelAdmin):
    list_display=['school', 'degree', 'start_date', 'end_date', 'is_public']

class ExperienceAdmin(admin.ModelAdmin):
    list_display=['work_name', 'job', 'start_date', 'end_date', 'is_public']

class ConnectionNotificationAdmin(admin.ModelAdmin):
    list_display=['id']

class PostNotificationAdmin(admin.ModelAdmin):
    list_display=['id']

class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'location', 'created_at', 'creator']

class CommentAdmin(admin.ModelAdmin):
    list_display = ('comment_author', 'comment_body', 'created_at', 'post')
    

class InterestAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'created_at']

class ViewAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'viewed_at']    

class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'sender', 'content', 'timestamp']

class ConversationAdmin(admin.ModelAdmin):
    list_display = ['user1', 'user2', 'created_at']
    

admin.site.register(User,UserAdmin)
admin.site.register(Profile,ProfileAdmin)
admin.site.register(Connection,ConnectionAdmin)
admin.site.register(Post,PostAdmin)
admin.site.register(Skills,SkillsAdmin)
admin.site.register(Education,EducationAdmin)
admin.site.register(Experience,ExperienceAdmin)
admin.site.register(ConnectionNotification,ConnectionNotificationAdmin)
admin.site.register(PostNotification,PostNotificationAdmin)
admin.site.register(Job, JobAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Interest, InterestAdmin)
admin.site.register(View, ViewAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(Conversation, ConversationAdmin)