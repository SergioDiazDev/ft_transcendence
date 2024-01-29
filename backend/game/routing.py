from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
	re_path(r"wss/game/(?P<game_id>\w+)/$", consumers.GameConsumer.as_asgi(vs_ai = False)),
	re_path(r"wss/game_ai/(?P<game_id>\w+)/$", consumers.GameConsumer.as_asgi(vs_ai = True)),
]