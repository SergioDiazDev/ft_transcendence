from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib import messages

from django.http import JsonResponse

from django.db.models import Q
from .forms import SignupForm, UpdatePlayerForm

from .models import Player, PlayerFriend
from chat.models import Chat
from itertools import chain

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
	return render(request, 'main.html', context={"user": request.user})

@login_required
def friends_panel(request):

	Player.objects.filter(id = request.user.id).update(last_login=datetime.now())

	friends_join = chain(PlayerFriend.objects.filter(Q(myFriend=request.user.id ) & Q(block=False) & Q(status=True)).values_list("myUser", flat=True),
					PlayerFriend.objects.filter((Q(myUser=request.user.id) & Q(block=False) & Q(status=True))).values_list("myFriend", flat=True))
	pending_invites = PlayerFriend.objects.filter(Q(myFriend=request.user.id ) & Q(block=False) & Q(status=False)).values_list("id", flat=True)
	player_invited = PlayerFriend.objects.filter(Q(myFriend=request.user.id ) & Q(block=False) & Q(status=False)).values_list("myUser", flat=True)

	player_unread_messages = chain(Chat.objects.filter(Q(player_a=request.user.id) & Q(unread_A=True)).values_list("player_b", flat=True),
			  	 Chat.objects.filter(Q(player_b=request.user.id) & Q(unread_B=True)).values_list("player_a", flat=True))

	friends_unread = Player.objects.filter(id__in=player_unread_messages)
	friends = Player.objects.filter(id__in=friends_join)
	invites = Player.objects.filter(id__in=player_invited)

	pending_zip = zip(pending_invites, invites)

	return render(request, 'friends_panel.html', context={"user": request.user, "friends": friends,
		"pending_invites": pending_zip if len(pending_invites) > 0 else None, "friends_unread": friends_unread})

@login_required
def home(request):
	return render(request, 'home.html')

@login_required
def profile(request, username=None):
	if username:
		try:
			user = Player.objects.get(username=username)
		except Player.DoesNotExist:
			messages.error(request, f"The user {username} was not found.")
			return redirect("home")
	else:
		user = request.user

	matches = Match.objects.filter(Q(player1=user.id) | Q(player2=user.id))
	matches_won = Match.objects.filter(Q(winner=user.id)).count()
	#TODO: Add pagination to the matches in the backend
	win_rate = round(matches_won / matches.count() * 100) if matches.count() > 0 else 0

	return render(request, 'profile.html', context={"user": user, "matches": matches, "matches_won": matches_won, "win_rate": win_rate})

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

@login_required
def makeFriend(request, myFriend):
	myUser = request.user 

	if Player.objects.filter(username = myFriend).first() == None or myUser.username == myFriend :
		return JsonResponse({"username": None, "id": None})
	PlayerFriend.search_or_create(myUser.username, myFriend)

	return JsonResponse({"status": "ok"})

@login_required
def acceptFriend(request, invitation_id):
	PlayerFriend.objects.filter(id = invitation_id).update(status=True)
	return JsonResponse({"status": "ok"})

@login_required
def blockFriend(request, invitation_id):
	PlayerFriend.objects.filter(id = invitation_id).update(block=True)
	Chat.search_or_create(request.user.username, PlayerFriend.objects.filter(id = invitation_id).first().myFriend.username).delete()
	return JsonResponse({"status": "ok"})

@login_required
def blockFriendName(request, username):
	myUser = request.user
	myFriend = Player.objects.filter(username = username).first()
	invitation_id = PlayerFriend.objects.filter(Q(myUser=myUser.id ) & Q(myFriend=myFriend.id) |
												Q(myUser=myFriend.id ) & Q(myFriend=myUser.id)).first().id
	chat = Chat.search_or_create(request.user.username, myFriend.username)
	Chat.objects.filter(id=chat).delete()
	PlayerFriend.objects.filter(id = invitation_id).update(block=True)
	return JsonResponse({"status": "ok"})

#This method is used in tournament
@login_required
def getAvatar(request, username):
	 user = Player.objects.get(username = username)
	 user_avatar = str(user.avatar)
	 print(user_avatar, flush = True)
	 return JsonResponse({"enemy_avatar": user_avatar})
