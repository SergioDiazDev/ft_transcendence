import os

from channels.generic.websocket import AsyncWebsocketConsumer

from uuid import uuid4
import json

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
        print("Disconnect", flush = True)

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
            
        print(MatchmakingConsumer.users_searching, flush = True)



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