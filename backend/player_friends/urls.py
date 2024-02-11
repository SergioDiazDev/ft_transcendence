from django.urls import path

from . import views

urlpatterns = [
    path('friends/', views.showFriends, name="friends"),
    path('users/', views.showAll, name="users"),
    path('user/', views.findUser, name="user"),
   
]