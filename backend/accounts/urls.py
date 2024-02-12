from django.urls import path, include
from accounts import routing

from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('signup/', views.signup, name="signup"),
    path('profile/', views.profile, name="profile"),
    path('', include('django.contrib.auth.urls'), name="Accounts"),
    path('chat/<str:room_name>/', views.chat, name="chat"),
    path('ws/', include(routing.websocket_urlpatterns)),
]