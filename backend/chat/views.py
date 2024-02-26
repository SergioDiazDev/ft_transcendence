from django.shortcuts import render, redirect, get_object_or_404
from chat.models import Chat, Message
from django.urls import reverse
from django.http import HttpResponseForbidden, JsonResponse
from accounts.models import Player

def room(request, room_name):
    chat = Chat.objects.filter(id=room_name).first()
    if not chat:
        return HttpResponseForbidden("You are not allowed to join this chat room.")
    if request.user.username != chat.player_a.username and request.user.username != chat.player_b.username:
        return HttpResponseForbidden("You are not allowed to join this chat room.")
    return render(request, "chat/room.html", {"room_name": room_name,
                                              "a_name": chat.player_a.username,
                                              "b_name": chat.player_b.username })

def chat_view(request, user1, user2):
    # Buscar o crear la sala de chat y obtener su ID
    chat_id = Chat.search_or_create(user1, user2)
    if request.user.username != user1 and request.user.username != user2:
        return HttpResponseForbidden("You are not allowed to join this chat room.")
    return redirect(reverse('chat', kwargs={'room_name': chat_id}))

def mark_chat_as_read(request, chat_id, user_name):
    try:
        player = Player.objects.get(username=user_name)
        chat = Chat.objects.filter(id=chat_id).first()

        # Actualizar la variable unread del chat
        if chat.player_a == player:
            chat.unread_A = False
        elif chat.player_b == player:
            chat.unread_B = False
        chat.save()

        return JsonResponse({'success': True})
    except (Player.DoesNotExist, Chat.DoesNotExist):
        return JsonResponse({'success': False, 'error': 'Player or Chat does not exist'})
