from django.urls import re_path

from . import consumers
from chat import consumers as chat_consumers

websocket_urlpatterns = [
	re_path(r"wss/game/(?P<game_id>[^/]+)/$", consumers.GameConsumer.as_asgi(vs_ai = False)),
	re_path(r"wss/game_ai/(?P<game_id>[^/]+)/$", consumers.GameConsumer.as_asgi(vs_ai = True)),
    re_path(r"ws/chat/(?P<room_name>\w+)/$", chat_consumers.ChatConsumer.as_asgi()),
]