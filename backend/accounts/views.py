from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import SignupForm

from datetime import datetime

from .models import Player

from django.contrib.auth.decorators import login_required

def signup(request):
	if request.method == "POST":
		form = SignupForm(request.POST)
		if form.is_valid():
			user = form.save()
			login(request, user)
			return redirect("home")
	else:
		form = SignupForm()
	return render(request, 'registration/signup.html', {'form': form})

@login_required
def home(request):
	return render(request, 'home.html')

@login_required
def profile(request):
	return render(request, 'profile.html')

# Lo uso para trae cosas de la base, borrar para despliegue
def lista(request):
	# Update last_login
	if request.user.is_authenticated:
		request.user.last_login = datetime.now()
		request.user.save()
	users = Player.objects.all()
	return render(request, 'lista.html', {'users': users})
