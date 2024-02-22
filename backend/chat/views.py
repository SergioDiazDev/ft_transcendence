from django.shortcuts import render, redirect, get_object_or_404
from chat.models import Chat, Message
from django.urls import reverse
from django.http import HttpResponseForbidden

def index(request):
    return render(request, "chat/index.html")

def room(request, room_name):
    chat = Chat.objects.filter(id=room_name).first()
    if not chat:
        return HttpResponseForbidden("No tienes permiso para acceder a esta sala de chat.")
    if request.user.username != chat.player_a.username and request.user.username != chat.player_b.username:
        return HttpResponseForbidden("No tienes permiso para acceder a esta sala de chat.")
    return render(request, "chat/room.html", {"room_name": room_name})


def chat_view(request, user1, user2):
    # Buscar o crear la sala de chat y obtener su ID
    chat_id = Chat.search_or_create(user1, user2)
    if request.user.username != user1 and request.user.username != user2:
        return HttpResponseForbidden("No tienes permiso para acceder a esta sala de chat.")
    # Redirigir a la página de la sala de chat con el ID de la sala de chat en la URL
    return redirect(reverse('room', kwargs={'room_name': chat_id}))

from django.http import JsonResponse

def mark_message_as_read(request, message_id):
    try:
        message = Message.objects.get(id=message_id)
        message.read = True
        message.save()
        return JsonResponse({'success': True})
    except Message.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Message does not exist'})

