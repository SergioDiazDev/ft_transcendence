from django.urls import path, include

from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('signup/', views.signup, name="signup"),
    path('profile/<username>/', views.profile, name="profile"),
    path('edit_profile/', views.edit_profile, name="edit_profile"),
    path('logout/', views.my_logout, name="logout"),
    path('make-friend/<str:myFriend>', views.makeFriend, name="make_friend"),
    path('user/<str:find>', views.findUser, name="user_find"),
    path('accept-friend/<str:invitation_id>', views.acceptFriend, name="accept_friend"),
    path('block-friend/<str:invitation_id>', views.blockFriend, name="block_friend"),
    path('block-friend-name/<str:username>', views.blockFriendName, name="block_friend_name"),
    path('friends_panel/', views.friends_panel, name="friends_panel"),
    path('', include('django.contrib.auth.urls'), name="Accounts"),
    path('profile/avatar/<str:username>/', views.getAvatar)
]