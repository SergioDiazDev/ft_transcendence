from django.shortcuts import render

# Create your views here.
from django.contrib.auth.decorators import login_required

@login_required
def index(request, game_id, vs_ai=False):
	if vs_ai == 1:
		vs_ai = True
	return render(request, "game/index.html", {"game_id": game_id, "vs_ai": vs_ai})