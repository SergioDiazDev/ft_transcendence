import os
import json
import asyncio
import uuid

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from game.game_logic import PongGame

class GameConsumer(AsyncWebsocketConsumer):
	rooms = {}
	update_lock = asyncio.Lock()

	async def connect(self):
		# each consumer has a scope that contains info about its connection, like game_id in the URL
		# or the currently authenticated user
		# uncomment this line when users are implemented
		# self.user = self.scope["user"]

		self.user = str(uuid.uuid1())
		await self.accept()

		self.room_name = self.scope["url_route"]["kwargs"]["game_id"] 
		# construct a channel group based on the game_id (should be unique)
		self.room_group_name = f"game_{self.room_name}"

		await self.channel_layer.group_add(
			self.room_group_name, self.channel_name
		)

		print(f"Se ha unido el usuario {self.user} con el canal {self.channel_layer} al grupo {self.room_group_name}", os.getcwd(), flush=True)

		await self.send(
            text_data=json.dumps({"type": "player_join", "player_id": self.user})
        )

		async with self.update_lock:
			if self.room_group_name in self.rooms.keys():
				self.rooms[self.room_group_name]["players"][self.user] = {
					"id": self.user,
					"board_pos": len(self.rooms[self.room_group_name]["players"]),
					"direction": 0,
				}
			else:
				self.rooms[self.room_group_name] = {"players": {self.user: {}}}
				self.rooms[self.room_group_name]["players"][self.user] = {
					"id": self.user,
					"board_pos": 0,
					"direction": 0,
				}

			if len(self.rooms[self.room_group_name]["players"]) == 2:
				self.rooms[self.room_group_name]["game"] = PongGame()
				asyncio.create_task(self.game_loop())

	async def disconnect(self, close_code):
		async with self.update_lock:
			if self.user in self.rooms[self.room_group_name]["players"]:
				del self.rooms[self.room_group_name]["players"][self.user]

		# group_discard -> disconnect channel from the group
		await self.channel_layer.group_discard(
			self.room_group_name, self.channel_name
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		movement = text_data_json["movement"]
		player_id = text_data_json["player"]

		player = self.rooms[self.room_group_name]["players"].get(player_id, None)
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
					"room": event["room"],
					"objects": event["objects"],
					"gamestate": event["gamestate"],
				}
			)
		)

	async def game_loop(self):
		print(f"Game loop for room {self.room_group_name}", os.getcwd(), flush=True)
		#print("Rooms\n", self.rooms, "\n", os.getcwd(), flush=True)
		room = self.rooms.get(self.room_group_name, None)
		if room:
			#print(room, os.getcwd(), flush=True)
			while len(room["players"]) == 2:
				for player_id in room["players"]:
					player = room["players"][player_id]
					#print(player, os.getcwd(), flush=True)
					if player["board_pos"] == 0:
						room["game"].pad1.move(player["direction"])
					elif player["board_pos"] == 1:
						room["game"].pad2.move(player["direction"])
				room["game"].calculate_frame()

				await self.channel_layer.group_send(
					self.room_group_name,
					{"type": "gamestate_update", "room": self.room_group_name, "objects": list(room["players"]), "gamestate": room["game"].get_gamestate()},
				)
				await asyncio.sleep(0.016)