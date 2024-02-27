from django.shortcuts import render
from accounts.models import Player

# Create your views here.
def matchmaking(request):
    user = Player.objects.get(username=request.user)
    return render(request, "matchmaking.html", {"user": user})

def tournament(request):
    return render(request, "tournament.html")