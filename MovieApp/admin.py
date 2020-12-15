from django.contrib import admin
from .models import  Comment, Movie, User

# Register your models here.
class MovieAdmin(admin.ModelAdmin):
    list_display = ("id","netflixId","title", "description", "imdb_rating", "runtime")

    # filter_horizontal = ("comment")
class CommentAdmin(admin.ModelAdmin):
    list_display = ("user","comment", "timestamp")

class UserAdmin(admin.ModelAdmin):
    filter_horizontal = ("watchlist",)

# admin.site.register(Bid)
admin.site.register(Comment)
admin.site.register(Movie, MovieAdmin)
admin.site.register(User, UserAdmin)