import os
import asyncio
import copy

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from uuid import uuid4
import json

from game.models import Match
from .models import Tournament

class MatchmakingConsumer(AsyncWebsocketConsumer):
    users_searching = []

    async def connect(self, *args, **kwargs):
        if self.scope["user"].is_authenticated:
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # print("Disconnect", flush = True)

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        if data_json["search"]:
            if len(MatchmakingConsumer.users_searching) <= 0:
                myuuid = uuid4()
                myuuid = str(myuuid)
                #Replace '-' in uuid, due to url errors
                myuuid = myuuid.replace("-", "")

                MatchmakingConsumer.users_searching.append({myuuid: str(self.scope["user"])})
                self.room_group_name = f"matchmaking-{myuuid}"
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            elif len(MatchmakingConsumer.users_searching) > 0 and not self.check_user_is_present(str(self.scope["user"])):
                keys_list = list(MatchmakingConsumer.users_searching[0].keys())
                myuuid = keys_list[0]
                self.room_group_name = f"matchmaking-{myuuid}"
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                message = {"uuid_game": str(myuuid), "player1": str(MatchmakingConsumer.users_searching[0][myuuid]),
                    "player2": str(self.scope["user"]), "info": True,  "close": True}
                await self.channel_layer.group_send(
                    self.room_group_name, {"type": "matchmaking.message", "message": message}
                )
                del MatchmakingConsumer.users_searching[0]
            
        # print(MatchmakingConsumer.users_searching, flush = True)



    async def matchmaking_message(self, event):
        message = event["message"]

        await self.send(text_data = json.dumps({"message": message}))


    def check_user_is_present(self, user_name):

        for i in range(len(MatchmakingConsumer.users_searching)):
            keys = MatchmakingConsumer.users_searching[i].keys()
            for key in keys:
                if(MatchmakingConsumer.users_searching[i][key] == user_name):
                    return True
        return False

# Tournament Consumer
class TournamentConsumer(AsyncWebsocketConsumer):
    waiting_room = []
    player_channels = []
    rooms = {}
    update_lock = asyncio.Lock()

    async def connect(self, *args, **kwargs):
        self.user = str(self.scope["user"])

        async with self.update_lock:
            if self.user not in self.waiting_room and len(self.waiting_room) < 4:
                self.waiting_room.append(self.user)
                self.player_channels.append(self.channel_name)
                await self.accept()
                await self.channel_layer.group_add(self.user, self.channel_name)

            if len(self.waiting_room) == 4:
                id = str(uuid4())
                self.rooms[id] = {"players": copy.deepcopy(self.waiting_room),
                                  "channels": copy.deepcopy(self.player_channels)}

                self.waiting_room.clear()
                self.player_channels.clear()

                for channel in self.rooms[id]["channels"]:
                    await self.channel_layer.group_add(id, channel)

                asyncio.create_task(self.tournament_loop(id))

    async def disconnect(self, close_code):
        """ async with self.update_lock:
            for room in self.rooms:
                if "players" in room.keys():
                    for player in room["players"]:
                        if player == self.user:
                            room["players"].remove(self.user)
        """
        await self.channel_layer.group_discard(
			self.user, self.channel_name
		)

    async def tournament_status(self, event):
        await self.send(
            text_data = json.dumps(
                {
                    "type": "status",
                    "match1": event["match1"],
                    "match2": event["match2"],
                    "match3": event["match3"],
                }
            )
        )

    async def new_game(self, event):
        await self.send(
            text_data = json.dumps(
                {
                    "type": "new_game",
                    "game_id": event["game_id"],
                }
        ))

    async def winner(self, event):
        await self.send(
            text_data = json.dumps(
                {
                    "type": "winner",
                    "winner": event["winner"],
                }
        ))



    async def tournament_loop(self, id):
        async with self.update_lock:
            room = self.rooms[id]

        match1 = [room["players"][0], room["players"][1]]
        match1_id = str(uuid4())
        match2 = [room["players"][2], room["players"][3]]
        match2_id = str(uuid4())

        # aqui ya están los 4
        await self.channel_layer.group_send(
            id, {"type": "tournament_status", "match1": match1, "match2": match2, "match3": []}
        )

        # aqui se les manda mensajes a cada jugador
        asyncio.sleep(5)
        for user, channel in zip(room["players"], room["channels"]):
            if user in match1:
                game_id = match1_id
            if user in match2:
                game_id = match2_id
            await self.channel_layer.send(channel, {"type": "new_game", "game_id": game_id})

        # get winners
        winner1 = await sync_to_async(Match.get_winner)(match1_id)
        winner2 = await sync_to_async(Match.get_winner)(match2_id)

        while not winner1 or not winner2:
            asyncio.sleep(5)
            if not winner1:
                winner1 = await sync_to_async(Match.get_winner)(match1_id)
            if not winner2:
                winner2 = await sync_to_async(Match.get_winner)(match2_id)

        winner_match = [winner1.username, winner2.username]
        # print("winner_match", winner_match)

        asyncio.sleep(5)
        await self.channel_layer.group_send(
            id, {"type": "tournament_status", "match1": match1, "match2": match2, "match3": winner_match}
        )

        winner_match_id = str(uuid4())
        for user, channel in zip(room["players"], room["channels"]):
            if user in winner_match:
                await self.channel_layer.send(channel, {"type": "new_game", "game_id": winner_match_id})

        # get winners
        winner = await sync_to_async(Match.get_winner)(winner_match_id)
        while not winner:
            asyncio.sleep(5)
            winner = await sync_to_async(Match.get_winner)(winner_match_id)

        await self.channel_layer.group_send(
            id, {"type": "winner", "winner": winner.username }
        )

        if (winner == winner1):
            await sync_to_async(Tournament.objects.create)(
                id=id,
                winner=winner,
                second=winner2
            )
        else:
            await sync_to_async(Tournament.objects.create)(
                id=id,
                winner=winner,
                second=winner1
            )

        # clear user channels
        async with self.update_lock:
            room = self.rooms[id]
            for user, channel in zip(room["players"], room["channels"]):
                await self.channel_layer.group_discard(id, channel)

        # clear group channel
        await self.channel_layer.group_discard(
			self.user, self.channel_name
		)

        del self.rooms[id]