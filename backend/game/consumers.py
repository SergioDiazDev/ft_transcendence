import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class GameConsumer(WebsocketConsumer):
	def connect(self):
		# each consumer has a scope that contains info about its connection, like game_id in the URL
		# or the currently authenticated user
		self.room_name = self.scope["url_route"]["kwargs"]["game_id"] 
		# construct a channel group based on the game_id (should be unique)
		self.room_group_name = f"game_{self.room_name}"

		# the async_to_sync wrapper is required because GameConsumer
		# is synchronous but is calling a Channel (all Channel are asynchronous)
		# group_add -> join the group
		async_to_sync(self.channel_layer.group_add)(
			self.room_group_name, self.channel_name
		)
		# accept the websocket connection, if we remove this, the user will be rejected,
		# its useful for example for authenticating users
		self.accept()

	def disconnect(self, close_code):
		# group_discard -> disconnect channel from the group
		async_to_sync(self.channel_layer.group_discard)(
			self.room_group_name, self.channel_name
		)

	def receive(self, text_data):
		text_data_json = json.loads(text_data)
		movement = text_data_json["movement"]

		# group_send -> sends an event to a group
		# events have special 'type' key, corresponding with the name of the method that should be
		# invoked on consumers, replacing game.movement with game_movement, calling the method below
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name, {"type": "game.movement", "movement": movement}
		)

	def game_movement(self, event):
		movement = event["movement"]
		self.send(text_data=json.dumps({"movement": movement}))