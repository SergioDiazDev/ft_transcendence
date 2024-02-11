from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import SignupForm

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
	usuarios = Player.objects.all()
	return render(request, 'profile.html', {'usuarios': usuarios})
	return render(request, 'profile.html')

# # No se si esto iria aqui.
# def lista_usuarios(request):
   
    