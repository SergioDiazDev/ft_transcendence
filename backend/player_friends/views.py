from django.shortcuts import render

from .models import PlayerFriend
from accounts.models import Player

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

	return render(request, 'friends.html', {'friends': friends, "users": users, "find_user": find_user})

@login_required
def showAll(request):
	return render(request, 'users.html', {'users': users})

@login_required
def findUser(request):
	find = request.GET.get('user')
	if find:
		user = PlayerFriend.objects.filter(username = find)
	else:
		user = None
	return render(request, 'finduser.html', {'user': user})