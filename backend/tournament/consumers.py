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

# Tournament Consumer
class TournamentConsumer(AsyncWebsocketConsumer):
    first_win = "first_win"
    second_win = "second_win"
    notdefined = "undefined"
    four_player_tournaments =  {
        "1234":
        {
            "sala00": ["jugador 1", "jugador 2"],
            "sala01": [],
            "sala02": ["jugador 5", "jugador 6"],
            "sala03": ["jugador 7", "jugador 8"],
            "sala04": [],
            "sala05": [],
            "sala06": []
        }
    }

    four_player_tournaments_results = {
        "1234":
        {
            "sala00": notdefined,
            "sala01": notdefined,
            "sala02": notdefined,
            "sala03": notdefined
        }
    }
    
    async def connect(self, *args, **kwargs):
        if self.scope["user"].is_authenticated:
            self.username = str(self.scope["user"])
            await self.accept()
        else:
            await self.close()
    
    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        len_keys = len(data_json.keys())
        if len_keys > 0:
            if "info" in data_json.keys():
                if data_json["info"] == "SEARCHING4":
                    self.check_user_is_present(self.username, remove = True)
                    keys = self.get_slot_4(self.username)
                    self.own_group_name = f"{keys["tournament_key"]}{keys["room_key"]}{self.username}"
                    self.match_group_name = f"{keys["tournament_key"]}{keys["room_key"]}"
                    self.tournament_group_name = f"tournament{keys["tournament_key"]}"
                    
                    print(self.tournament_group_name, flush = True)
                    # Add groups to player
                    await self.channel_layer.group_add(self.own_group_name, self.channel_name)
                    await self.channel_layer.group_add(self.match_group_name, self.channel_name)
                    await self.channel_layer.group_add(self.tournament_group_name, self.channel_name)
                    
                    # Send info back to client
                    message = {"info": "FOUND", "players": TournamentConsumer.four_player_tournaments[keys["tournament_key"]]}
                    await self.channel_layer.group_send(
                    self.own_group_name, {"type": "tournament.message", "message": message}
                    )

                    # Check if tournament is full, and if its full we notify to all players
                    if self.check_tournament_full(keys["tournament_key"]):
                        
                        message = {"tournament_ready": True}
                        print("tournament_group_name", self.tournament_group_name , flush = True)
                        await self.channel_layer.group_send(
                            self.tournament_group_name, {"type": "tournament.message", "message": message}
                        )

                elif data_json["info"] == "READY":
                    keys = self.get_keys(self.username)
                    # Add to group of match
                    self.match_group_name = f"{keys["tournament_key"]}{keys["room_key"]}"
                    await self.channel_layer.group_add(self.match_group_name, self.channel_name)
                    message = {"info": "MATCH_FOUND", "game_key": f"{keys["tournament_key"]}{keys["room_key"]}" }
                    await self.channel_layer.group_send(
                    self.match_group_name, {"type": "tournament.message", "message": message}
                    )

    async def tournament_message(self, event):
        message = event["message"]

        await self.send(text_data = json.dumps({"message": message}))

    # Auxiliar methods

    def check_user_is_present(self, username, remove = False):
        
        tournament_keys = TournamentConsumer.four_player_tournaments.keys()
        # Check number of tournaments in active
        if len(tournament_keys) > 0:
            for tournament_key in tournament_keys:
                # Get room ids
                room_keys = TournamentConsumer.four_player_tournaments[tournament_key].keys()
                if len(room_keys) > 0:
                    for room_key in room_keys:
                        if username in TournamentConsumer.four_player_tournaments[tournament_key][room_key]:
                            # User found
                            if remove:
                                number_player = TournamentConsumer.four_player_tournaments[tournament_key][room_key].index(username)
                                TournamentConsumer.four_player_tournaments[tournament_key][room_key].remove(username)
                                if number_player == 0:
                                    TournamentConsumer.four_player_tournaments_results[tournament_key][room_key] = TournamentConsumer.second_win
                                else:
                                    TournamentConsumer.four_player_tournaments_results[tournament_key][room_key] = TournamentConsumer.first_win
                            return True
        
        # By defect
        return False


    def check_not_valid_rooms_4(self, room_key):
        if room_key == "sala04" or room_key == "sala05" or room_key == "sala05":
            return True
        return False

    def get_slot_4(self, username):
        tournament_keys = TournamentConsumer.four_player_tournaments.keys()

        # Check number of tournament keys
        if len(tournament_keys) < 0:
            # TODO create tournament if there is no tournament created
            pass
        elif len(tournament_keys) > 0:
            for tournament_key in tournament_keys:
                # Get room ids
                room_keys = TournamentConsumer.four_player_tournaments[tournament_key].keys()
                if len(room_keys) > 0:
                    for room_key in room_keys:
                        if len(TournamentConsumer.four_player_tournaments[tournament_key][room_key]) < 2 and not self.check_not_valid_rooms_4(room_key):
                            TournamentConsumer.four_player_tournaments[tournament_key][room_key].append(username)
                            return {"tournament_key": tournament_key, "room_key": room_key}
            return {"tournament_key": "", "room_key": ""}
            #TODO create tournament if all slots are full

    def check_tournament_full(self, tournament_key):
        if len(tournament_key):
            tournament_keys = TournamentConsumer.four_player_tournaments.keys()

            if len(tournament_keys) > 0 and (tournament_key in tournament_keys):
                # Then tournament exist
                room_keys = TournamentConsumer.four_player_tournaments[tournament_key].keys()
                
                for room_key in room_keys:
                    if room_key == "sala00" or room_key == "sala01" or room_key == "sala02" or room_key == "sala03":
                        if len(TournamentConsumer.four_player_tournaments[tournament_key][room_key]) < 2:
                            return False
        # By defect return False
        return True

    def get_keys(self, username):
        tournament_keys = TournamentConsumer.four_player_tournaments.keys()

        # Check number of tournament keys
        if len(tournament_keys) > 0:
            for tournament_key in tournament_keys:
                # Get room ids
                room_keys = TournamentConsumer.four_player_tournaments[tournament_key].keys()
                if len(room_keys) > 0:
                    for room_key in room_keys:
                        if username in TournamentConsumer.four_player_tournaments[tournament_key][room_key]:
                            return {"tournament_key": tournament_key, "room_key": room_key}
        return {"tournament_key": "", "room_key": ""}