from django.urls import re_path
from .consumers import MatchmakingConsumer, TournamentConsumer

websocket_urlpatterns = [
        re_path(r"ws/matchmaking/$", MatchmakingConsumer.as_asgi()),
        re_path(r"ws/tournament/$", TournamentConsumer.as_asgi()),

]