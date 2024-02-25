from django.urls import path

from . import views

urlpatterns = [
    path('sala/<str:user1>+<str:user2>/', views.chat_view, name='sala'),  # Definir la URL para el chat
    path("chat/<int:room_name>/", views.room, name="chat"),
	path('mark-message-as-read/<int:message_id>/', views.mark_message_as_read, name='mark_message_as_read'),
	path('mark-history-as-read/<int:chat_id>/<str:user_name>/', views.mark_history_as_read, name='mark_history_as_read'),
]
