from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib import messages

from django.db.models import Q
from .forms import SignupForm, UpdatePlayerForm

from .models import Player, PlayerFriend
from game.models import Match

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
	user = request.user
	matches = Match.objects.filter(Q(player1=user.id) | Q(player2=user.id))
	matches_won = Match.objects.filter(Q(winner=user.id)).count()
	#TODO: Add pagination to the matches in the backend
	win_rate = round(matches_won / matches.count() * 100) if matches.count() > 0 else 0

	return render(request, 'profile.html', context={"matches": matches, "matches_won": matches_won, "win_rate": win_rate})

@login_required
def edit_profile(request):
	if request.method == "POST":
		user_form = UpdatePlayerForm(request.POST, request.FILES, instance=request.user)
		password_form = PasswordChangeForm(user=request.user, data=request.POST)

		if user_form.is_valid() and user_form.has_changed():
			user_form.save()
			messages.success(request, "Profile details updated.")
		else:
			messages.error(request, user_form.errors)
		if request.POST.get("new_password1") != "" or request.POST.get("new_password2") != "":
			if password_form.is_valid():
				password_form.save()
				update_session_auth_hash(request, password_form.user)
				messages.success(request, "Password updated.")
			else:
				messages.error(request, password_form.errors)

		return redirect("main")
	else:
		user_form = UpdatePlayerForm(instance=request.user)
		password_form = PasswordChangeForm(request.user)
		return render(request, "edit_profile.html", context={'user_form': user_form, 'password_form': password_form})

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
	now_utc = datetime.now(timezone.utc)
	one_hour_ago_utc = now_utc - timedelta(hours=1)

	for user in users:
		if user.last_login and user.last_login.replace(tzinfo=timezone.utc) > one_hour_ago_utc:
			user.isactive = True
		else:
			user.isactive = False
	return render(request, 'friends.html', {'users': users})