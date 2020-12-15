import json
import os
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse



from .models import User, Movie, Comment



def index(request):

    isWatchlisted = False
    comments = json.dumps([])
    
    return render(request, "movies/index.html", {
        "isWatchlisted" : isWatchlisted, 
        "comments": comments,
      
        "rapid_api_key": json.dumps(os.environ.get('RAPID_API_KEY'))
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "movies/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "movies/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "movies/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "movies/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "movies/register.html")

@csrf_exempt
@login_required
def addItem(request, itemID):
    if request.method == "POST":
  
        print('YOU WIN')
        data = json.loads(request.body)
        print(data['body']['netflixid'])
        tryMovieItem = None
        tryWatchlisted = None
        commentsList = None
        try:
            tryMovieItem = Movie.objects.get(netflixId=itemID)
        except:
            print('No match')
        try:
            tryWatchlisted = tryMovieItem.watchlisted_by.get(request.user.id)
        except:
            print('No Watchlist match')
        if tryMovieItem is not None:
            # get comments
            #  itemSearch = Listing.objects.get(title=item)
            commentsList = Comment.objects.filter(movie=tryMovieItem).all()
            # "comments": Comment.objects.filter(item=itemSearch).all()
           
            isWatchlisted = False
            if tryWatchlisted is not None:
                isWatchlisted = True
            print('true watchlist')
            # return JsonResponse(data=watchlisted, status=200, safe=False)
           
        else:

            media_item = data['body']
            # userData = User.objects.get(id=request.user.id)
            new_movie = Movie(
                netflixId = media_item['netflixid'],
                title = media_item['title'],
                description = media_item['synopsis'],
                imdb_rating = media_item['rating'],
                runtime = media_item['runtime'],
                release_year = media_item['released'],
                image = media_item['image'],
                  )
            new_movie.save()
            isWatchlisted = False
            print('false')
            # return JsonResponse(data=watchlisted, status=200, safe=False)   
        comments = json.dumps([{"comment":"dude", "user":"nateSS"}, {"comment":"try", "user":"dogSS"}])    
        # comments = json.dumps(commentsList.serialize())
        if commentsList is not None:
            comments = json.dumps([comment.serialize() for comment in commentsList])
            return JsonResponse({"comments":[comment.serialize() for comment in commentsList],"isWatchlisted":isWatchlisted}, safe=False)
        else:
            comments = []
            return JsonResponse({"comments":comments,"isWatchlisted":isWatchlisted}, safe=False)
        # else:
        #   comments = []
        # return render(request, "movies/index.html",{
        #     "isWatchlisted" : isWatchlisted,
        #     "comments": comments,
        # })
@csrf_exempt
@login_required
def addWatchlistItem(request, itemID):
    if request.method == "PUT":
  
        print('YOU Still WIN')
        # userData = User.objects.get(id=request.user.id)
        movieData = Movie.objects.get(netflixId=itemID)
        movieData.watchlisted_by.add(request.user.id)
        isWatchlisted = True
        # userData.save()
        movieData.save()
    
    if request.method == "DELETE":
        isWatchlisted = False
        print('YOU Still WIN')
        # userData = User.objects.get(id=request.user.id)
        movieData = Movie.objects.get(netflixId=itemID)
        movieData.watchlisted_by.remove(request.user.id)
        # userData.save()
        movieData.save()

    return render(request, "movies/index.html",{
            "isWatchlisted" : isWatchlisted
        })   

  
@csrf_exempt
@login_required
def addItemComment(request, itemID):
    if request.method == "POST":
      
        data = json.loads(request.body)
        comment = data["body"]
        user = User.objects.get(id=request.user.id)
        movie = Movie.objects.get(netflixId=itemID)
        new_comment = Comment(comment = comment, user = user, movie = movie)
        new_comment.save()
    
        commentsList = Comment.objects.filter(movie=movie).all()
        tryWatchlisted = None
        try:
            tryWatchlisted = movie.watchlisted_by.get(request.user.id)
        except:
            print('No Watchlist match')
        
        if tryWatchlisted is not None:
            isWatchlisted = True
        else:
            isWatchlisted = False
        # print(comments[0]["user"])
        # comments = json.dumps([{"comment":"dude", "user":"nateCC"}, {"comment":"try", "user":"dogCC"}])
        return JsonResponse([comment.serialize() for comment in commentsList], safe=False)
        # comments = json.dumps([comment.serialize() for comment in commentsList])
        # return render(request, "movies/index.html",{
        #     "isWatchlisted" : isWatchlisted,

        #     "comments": comments,

        # })   


    if request.method == "DELETE":
        comment = Comment.objects.get(id=itemID)
        print(comment)
        if request.user == comment.user:
            comment.delete()
 
       

        return HttpResponse(status=200)
    return HttpResponse(status=500)

def getItemComments(request, itemID):
    
    try:
        movie = Movie.objects.get(netflixId=itemID)
        commentsList = Comment.objects.filter(movie=movie).all()
        return JsonResponse([comment.serialize() for comment in commentsList], safe=False)
    except:
        print('no comments')
        return JsonResponse(status=200, safe=False)


def viewWatchlist(request, userID):
        userData = User.objects.get(id=userID)
        print('user')
        print(userData)
        watchlistData = list(userData.watchlist.all().values())
        watchlist = []
        # for mediaItem in watchlistData:
        #     print(mediaItem)
            # watchlist.append(mediaItem)
        


        print(watchlistData)
        # return JsonResponse([item.serialize() for item in watchlistData], safe=False)
        return JsonResponse(watchlistData, safe=False)

def getItem(request, itemID):
    movie = Movie.objects.get(id=itemID)
    commentsList = Comment.objects.filter(movie=movie).all()
    itemData = list(Movie.objects.filter(id=itemID).values())
 
    # commentsList = list(Comment.objects.filter(movie=itemID).values())
    # print(commentsList)
    data = {
        "comments" : [comment.serialize() for comment in commentsList],
        "item": itemData[0]

    }
    print(data)
    # data = itemData
    # item = json.dumps(itemData)
    # print(item)
    return JsonResponse(data, safe=False)