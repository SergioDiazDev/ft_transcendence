from django.shortcuts import render

from .models import PlayerFriend
from accounts.models import Player

from datetime import datetime, timedelta, timezone

from django.contrib.auth.decorators import login_required
from chat.models import Chat, Message
from django.db.models import Q

# def has_unread_messages(user, other_user):
#     # Buscar si hay una conversación abierta con el otro usuario
#     chat_id = Chat.objects.filter(Q(player_a=user, player_b=other_user) | Q(player_a=other_user, player_b=user)).first()
    
#     if chat_id:
#         # Si se encuentra una conversación, obtener los mensajes no leídos
#         unread_messages = Message.objects.filter(chat_id=chat_id, read='f', sender=other_user)
#         return True
    
#     return False

@login_required
def showFriends(request):
	friends = PlayerFriend.objects.filter(myUser=request.user)

	users = Player.objects.all()

	find_user = None
	find = request.GET.get('user')
	print("find =", request.GET.get('user'))
	if find:
		find_user = PlayerFriend.objects.filter(myFriend__username=find).first()
	
	now_utc = datetime.now(timezone.utc)

	# Definir el límite de una hora atrás en UTC
	one_hour_ago_utc = now_utc - timedelta(hours=1)

	for user in users:
		if user.last_login and user.last_login.replace(tzinfo=timezone.utc) > one_hour_ago_utc:
			user.isactive = True
		else:
			user.isactive = False
	# 	has_messages = has_unread_messages( request.user.id ,user.id)
	# print("USER:")
	# print(dir(request))
	return render(request, 'friends.html', {'friends': friends, "users": users, "find_user": find_user})

@login_required
def showAll(request):
	users = Player.objects.all()
	return render(request, 'users.html', {'users': users})

@login_required
def findUser(request):
	find = request.GET.get('user')
	if find:
		user = PlayerFriend.objects.filter(username = find)
	else:
		user = None
	return render(request, 'finduser.html', {'user': user})

@login_required
def isactive(request):
	users = Player.objects.all()
	one_hour_ago_utc = now_utc - timedelta(hours=1)

	for user in users:
		if user.last_login and user.last_login.replace(tzinfo=timezone.utc) > one_hour_ago_utc:
			user.isactive = True
		else:
			user.isactive = False
	return render(request, 'friends.html', {'users': users})