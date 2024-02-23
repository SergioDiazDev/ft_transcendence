from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:room_name>/", views.room, name="room"),
    path('sala/<str:user1>+<str:user2>/', views.chat_view, name='chat'),  # Definir la URL para el chat
    path("chat/<int:room_name>/", views.room, name="chat"),
	path('mark-message-as-read/<int:message_id>/', views.mark_message_as_read, name='mark_message_as_read'),
]
