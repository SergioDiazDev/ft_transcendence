from django.urls import path, include

from . import views

urlpatterns = [
    path("matchmaking/", views.matchmaking, name="matchmaking"),
]