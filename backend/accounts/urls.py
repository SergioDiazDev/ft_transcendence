from django.urls import path, include

from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('signup/', views.signup, name="signup"),
    path('profile/<username>/', views.profile, name="profile"),
    path('lista/', views.lista, name="lista"),
    path('edit_profile/', views.edit_profile, name="edit_profile"),
    path('logout/', views.my_logout, name="logout"),
    path('friends/', views.showFriends, name="friends"),
    path('users/', views.showAll, name="users"),
    path('user/', views.findUser, name="user"),
    path('', include('django.contrib.auth.urls'), name="Accounts"),
    path('profile/avatar/<str:username>/', views.getAvatar)
]