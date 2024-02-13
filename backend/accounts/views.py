from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from .forms import SignupForm

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