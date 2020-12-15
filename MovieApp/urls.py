
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    # path("movie_search", views.movie_search, name="movie_search"),
    path("addWatchlistItem/<str:itemID>", views.addWatchlistItem, name="addWatchlistItem"),
    path("addItemComment/<str:itemID>", views.addItemComment, name="addItemComment"),
    path("getItem/<str:itemID>", views.getItem, name="getItem"),
    path("getItemComments/<str:itemID>", views.getItemComments, name="getItemComments"),
    path("viewWatchlist/<str:userID>", views.viewWatchlist, name="viewWatchlist"),
    path("addItem/<str:itemID>", views.addItem, name="addItem"), 
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")

]