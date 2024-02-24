from django.shortcuts import render, redirect, HttpResponse
from django.http import JsonResponse
from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib import messages

from django.db.models import Q
from .forms import SignupForm, UpdatePlayerForm

from .models import Player, PlayerFriend
from chat.models import Chat, Message

from game.models import Match

from datetime import datetime, timedelta, timezone

from datetime import datetime

from .models import Player

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
	# TODO: friends right now are all players, change when friends are ok
	friends = Player.objects.all()
	return render(request, 'main.html', context={"user": request.user, "friends": friends})

@login_required
def friends_panel(request):
	# TODO: friends right now are all players, change when friends are ok
	friends = Player.objects.all()
	return render(request, 'friends_panel.html', context={"user": request.user, "friends": friends})

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

# Lo uso para trae cosas de la base, borrar para despliegue
def lista(request):
	# Update last_login
	if request.user.is_authenticated:
		request.user.last_login = datetime.now()
		request.user.save()
	users = Player.objects.all()
	return render(request, 'lista.html', {'users': users})

@login_required
def edit_profile(request):
	if request.method == "POST":
		user_form = UpdatePlayerForm(request.POST, request.FILES, instance=request.user)
		password_form = PasswordChangeForm(user=request.user, data=request.POST)

		if user_form.is_valid() and user_form.has_changed():
			avatar = user_form.cleaned_data['avatar']
			if avatar:
				filename = f"avatar_{request.user.id}.{avatar.name.split(".")[-1]}"
				avatar_path = f"static/img/avatars/{filename}"
				with open(avatar_path, 'wb+') as destination:
					for chunk in avatar.chunks():
						destination.write(chunk)
				request.user.avatar = filename
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
def findUser(request, find):

	if find:
		user = Player.objects.filter(username = find).first()
	else:
		user = None
	if user == None:
		return JsonResponse({"username": None, "id": None})
	return JsonResponse({'username': user.username, 'id': user.id })
@login_required
def makeFriend(request, myFriend):
	myUser = request.user

	if Player.objects.filter(id = myUser.id).first() == None:
		return JsonResponse({"username": None, "id": None})
	PlayerFriend.search_or_create(myUser.username, myFriend)

	chat_id = Chat.search_or_create(myUser.username, myFriend)
	message_content = "ivita"
	Message.create(chat_id, message_content, myUser)
	return JsonResponse({})




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