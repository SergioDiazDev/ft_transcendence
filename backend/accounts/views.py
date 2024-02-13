from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from .forms import SignupForm

from .models import Player, PlayerFriend

from datetime import datetime, timedelta, timezone

from django.contrib.auth.decorators import login_required

def signup(request):
	if request.method == "POST":
		form = SignupForm(request.POST)
		if form.is_valid():
			user = form.save()
			login(request, user)
			return redirect("main")
	else:
		form = SignupForm()
	return render(request, 'registration/signup.html', {'form': form})

@login_required
def main(request):
	return render(request, 'main.html')

@login_required
def home(request):
	return render(request, 'home.html')

@login_required
def profile(request):
	return render(request, 'profile.html')

@login_required
def my_logout(request):
	logout(request)
	return redirect("login")

#PlayerFriends

@login_required
def showFriends(request):

	find_user = None
	find = request.GET.get('user_tag')
	print("find =", request.GET.get('user_tag'))
	find_user = PlayerFriend.objects.filter(myFriend__username = find).first()
	print("find =", find_user)

	friends = PlayerFriend.objects.filter(myUser=request.user)

	users = Player.objects.all()

	# Actualizo mi usuario
	if request.user.is_authenticated:
		request.user.last_login = datetime.now()
		request.user.save()

	
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
	one_hour_ago_utc = now_utc - timedelta(hours=1)

	for user in users:
		if user.last_login and user.last_login.replace(tzinfo=timezone.utc) > one_hour_ago_utc:
			user.isactive = True
		else:
			user.isactive = False
	return render(request, 'friends.html', {'users': users})