from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    watchlist = models.ManyToManyField('Movie', default=None, blank=True, related_name='watchlisted_by')
    watched = models.ManyToManyField('Movie', default=None, blank=True, related_name='watched_by')

class Movie(models.Model):
    netflixId = models.IntegerField()
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=500, blank=True)
    imdb_rating = models.DecimalField(max_digits=3, decimal_places=1)
    runtime = models.CharField(max_length=300, blank=True)
    image = models.URLField(blank=True)
    release_year = models.CharField(max_length=10, blank=True, default = None)

    
    def __str__(self):
        return f"{self.id} - {self.netflixId} - {self.title}"
    def serialize(self):
        return {
            "id": self.id,
            "netflixId": self.netflixId,
            "title" : self.title,
            "description" : self.description,
            "imdb_rating" : self.imdb_rating,
            "runtime" : self.runtime,
            "image" : self.image,
            "release_year" : self.release_year
        }
    
    
class Comment(models.Model):
    movie = models.ForeignKey(Movie,on_delete=models.CASCADE, related_name="comment_movie")
    comment = models.CharField(max_length=200)
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="comment_user")
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "movie": self.movie.netflixId,
            "user_id": self.user.id,
            "user": self.user.username,
            "comment": self.comment,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")

        }
