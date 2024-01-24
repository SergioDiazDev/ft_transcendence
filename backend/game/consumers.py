import json
import asyncio
import uuid

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from game.game_logic import PongGame

class GameConsumer(AsyncWebsocketConsumer):
	players = {}
	game = PongGame()
	update_lock = asyncio.Lock()

	async def connect(self):
		# each consumer has a scope that contains info about its connection, like game_id in the URL
		# or the currently authenticated user

		# uncomment this line when users are implemented
		# self.user = self.scope["user"]
		self.user = str(uuid.uuid1())
		async with self.update_lock:
			if len(self.players) == 2:
				return
		await self.accept()

		self.room_name = self.scope["url_route"]["kwargs"]["game_id"] 
		# construct a channel group based on the game_id (should be unique)
		self.room_group_name = f"game_{self.room_name}"

		# accept the websocket connection, if we remove this, the user will be rejected,
		# its useful for example for authenticating users

		# the async_to_sync wrapper is required because GameConsumer
		# is synchronous but is calling a Channel (all Channel are asynchronous)
		# group_add -> join the group
		await self.channel_layer.group_add(
			self.room_group_name, self.channel_name
		)

		await self.send(
            text_data=json.dumps({"type": "player_join", "player_id": self.user})
        )

		async with self.update_lock:
			self.players[self.user] = {
				"id": self.user,
				"board_pos": len(self.players),
				"direction": 0,
			}

		if len(self.players) == 2:
			asyncio.create_task(self.game_loop())

	async def disconnect(self, close_code):
		async with self.update_lock:
			if self.user in self.players:
				del self.players[self.user]
			if len(self.players) == 0:
				self.game = PongGame()

		# group_discard -> disconnect channel from the group
		await self.channel_layer.group_discard(
			self.room_group_name, self.channel_name
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		movement = text_data_json["movement"]
		player_id = text_data_json["player"]

		player = self.players.get(player_id, None)
		if not player:
			return

		if movement == "up":
			player["direction"] = 1
		elif movement == "down":
			player["direction"] = -1
		else:
			player["direction"] = 0

	async def gamestate_update(self, event):
		await self.send(
			text_data = json.dumps(
				{
					"type": "gamestate_update",
					"objects": event["objects"],
					"gamestate": self.game.get_gamestate(),
				}
			)
		)

	async def game_loop(self):
		while len(self.players) == 2:
			async with self.update_lock:
				for player in self.players.values():
					if player["board_pos"] == 0:
						self.game.pad1.move(player["direction"])
					elif player["board_pos"] == 1:
						self.game.pad2.move(player["direction"])
				self.game.calculate_frame()
				await asyncio.sleep(0.016)

			await self.channel_layer.group_send(
				self.room_group_name,
				{"type": "gamestate_update", "objects": list(self.players.values()), "gamestate": self.game.get_gamestate()},
			)