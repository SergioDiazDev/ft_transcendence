from django.urls import path

from . import views

urlpatterns = [
    path('sala/<str:user1>+<str:user2>/', views.chat_view, name='sala'),  # Definir la URL para el chat
    path("chat/<int:room_name>/", views.room, name="chat"),
	path('mark-chat-as-read/<int:chat_id>/<str:user_name>/', views.mark_chat_as_read, name='mark_chat_as_read'),
]
