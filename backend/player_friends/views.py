from django.shortcuts import render

from .models import PlayerFriend

from django.contrib.auth.decorators import login_required

@login_required
def showFriends(request):
	friends = PlayerFriend.objects.filter(myUser=request.user)
	return render(request, 'friends.html', {'friends': friends})

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