import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class GameConsumer(WebsocketConsumer):
	def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["game_id"]
		self.room_group_name = f"game_{self.room_name}"

		async_to_sync(self.channel_layer.group_add)(
			self.room_group_name, self.channel_name
		)
		self.accept()

	def disconnect(self, close_code):
		async_to_sync(self.channel_layer.group_discard)(
			self.room_group_name, self.channel_name
		)

	def receive(self, text_data):
		text_data_json = json.loads(text_data)
		movement = text_data_json["movement"]

		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name, {"type": "game.movement", "movement": movement}
		)

	def game_movement(self, event):
		movement = event["movement"]
		self.send(text_data=json.dumps({"movement": movement}))