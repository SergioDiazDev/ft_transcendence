from django.shortcuts import render

from .models import PlayerFriend
from accounts.models import Player

from datetime import datetime, timedelta, timezone

from django.contrib.auth.decorators import login_required

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
	for user in users:
		if (user.last_login > timezone.now() - timedelta(minutes=5)):
			user.isactive = True
		else:
			user.isactive = False
	return render(request, 'friends.html', {'users': users})