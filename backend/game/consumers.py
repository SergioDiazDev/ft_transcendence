import os
import json
import asyncio
import uuid

from channels.generic.websocket import AsyncWebsocketConsumer
from game.game_logic import PongGame

class GameConsumer(AsyncWebsocketConsumer):
	rooms = {}
	update_lock = asyncio.Lock()

	def __init__(self, *args, **kwargs):
		self.vs_ai = kwargs.pop("vs_ai", False)  # Get vs_ai parameter, default to False
		if self.vs_ai:
			print("Game vs AI", os.getcwd(), flush=True)
		else:
			print("Game vs another player", os.getcwd(), flush=True)
		super().__init__(*args, **kwargs)

	async def connect(self):
		# each consumer has a scope that contains info about its connection, like game_id in the URL
		# or the currently authenticated user
		# uncomment this line when users are implemented
		# self.user = self.scope["user"]
		self.user = str(uuid.uuid1())
		self.room_name = self.scope["url_route"]["kwargs"]["game_id"] 
		self.room_id = f"game_{self.room_name}"

		# the second player creates the game, if the game is created, nobody can join the room
		if self.room_id in self.rooms and "game" in self.rooms[self.room_id]:
			return

		async with self.update_lock:
			# first player joins the room
			if self.room_id not in self.rooms.keys():
				self.rooms[self.room_id] = {"players": {self.user: {}}}
				self.rooms[self.room_id]["players"][self.user] = {
					"board_pos": 1,
					"direction": 0,
				}
				#TODO: remove this comment when we have the user auth
				#self.rooms[self.room_id]["player1"] = self.user
				self.rooms[self.room_id]["player1"] = "Jugador 1"
			# second player joins the room
			else:
				self.rooms[self.room_id]["players"][self.user] = {
					"board_pos": 2,
					"direction": 0,
				}
				#TODO: remove this comment when we have the user auth
				#self.rooms[self.room_id]["player2"] = self.user
				self.rooms[self.room_id]["player2"] = "Jugador 2"
				self.rooms[self.room_id]["game"] = PongGame()
				asyncio.create_task(self.game_loop())

		await self.accept()
		await self.channel_layer.group_add(self.room_id, self.channel_name)
		await self.send(
			text_data=json.dumps({"type": "player_join", "player_id": self.user, "room_id": self.room_id })
		)

	async def disconnect(self, close_code):
		# group_discard -> disconnect channel from the group
		await self.channel_layer.group_discard(
			self.room_id, self.channel_name
		)

		async with self.update_lock:
			if self.room_id in self.rooms.keys():
				if self.user in self.rooms[self.room_id]["players"]:
					# remove the player from the room when he disconnects
					del self.rooms[self.room_id]["players"][self.user]

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		movement = text_data_json["movement"]
		player_id = text_data_json["player"]

		player = self.rooms[self.room_id]["players"].get(player_id, None)
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
					"gamestate": event["gamestate"],
				}
			)
		)

	async def goal_msg(self, event):
		await self.send(
			text_data = json.dumps(
				{
					"type": "goal_msg",
					"player": event["player"],
					"finish": event["finish"],
				}
			)
		)

	async def ready_msg(self, event):
		await self.send(
			text_data = json.dumps(
				{
					"type": "ready",
				}
			)
		)

	async def game_loop(self):
		# game countdown
		await self.channel_layer.group_send(
			self.room_id, {"type": "ready_msg"},
		)
		await asyncio.sleep(4)
		room = self.rooms.get(self.room_id, None)
		if room:
			while not room["game"].finish:
				for player_id in room["players"]:
					player = room["players"][player_id]
					if player["board_pos"] == 1:
						room["game"].pad1.move(player["direction"])
					elif player["board_pos"] == 2:
						room["game"].pad2.move(player["direction"])

				# delay after goals
				goal = room["game"].calculate_frame()
				if goal:
					await self.channel_layer.group_send(
						self.room_id,
						{
							"type": "goal_msg",
							"player": room[f"player{goal}"],
							"finish": room["game"].finish
						},
					)
					await asyncio.sleep(1)

				if len(room["players"]) == 0:
					break

				await self.channel_layer.group_send(
					self.room_id,
					{"type": "gamestate_update", "room": self.room_id, "gamestate": room["game"].get_gamestate()},
				)
				await asyncio.sleep(0.015625) # 64 ticks per second
			# game end notification
			# should write the result in the database
		# delete the room from the self.rooms object when the game is done
		await self.channel_layer.group_discard(
			self.room_id, self.channel_name
		)
		del self.rooms[self.room_id]