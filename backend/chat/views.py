from django.shortcuts import render


def index(request):
    return render(request, "chat/index.html")

def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})


from django.shortcuts import render, redirect
from chat.models import Chat

from django.urls import reverse

def chat_view(request, user1, user2):
    # Buscar o crear la sala de chat y obtener su ID
    chat_id = Chat.search_or_create(user1, user2)
    # Redirigir a la página de la sala de chat con el ID de la sala de chat en la URL
    return redirect(reverse('room', kwargs={'room_name': chat_id}))

