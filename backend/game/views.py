from django.shortcuts import render

# Create your views here.
def index(request, game_id):
	return render(request, "game/index.html", {"game_id": game_id})