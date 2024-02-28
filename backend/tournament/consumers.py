import os

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from uuid import uuid4
import json

from game.models import Match

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
    """
    matches_played = {
        "01234": 2,
    }

    locked_tournaments = []

    four_player_tournaments =  {
        "01234":
        {
            "sala00": ["jugador 1", "jugador 2"],
            "sala01": ["jugador 3", "jugador 4"],
            "sala02": [],
            "sala03": [],
            "sala04": ["jugador 1", "jugador 4"],
            "sala05": [],
            "sala06": ["jugador 4"]
        }
    }

    four_player_tournaments_results = {
        "01234":
        {
            "sala00": first_win,
            "sala01": second_win,
            "sala02": notdefined,
            "sala03": notdefined,
            "sala04": second_win,
            "sala05": notdefined,
            "sala06": notdefined
        }
    }
    """
    matches_played = {}

    locked_tournaments = []

    four_player_tournaments =  {}

    four_player_tournaments_results = {}

    async def connect(self, *args, **kwargs):
        if self.scope["user"].is_authenticated:
            self.username = str(self.scope["user"])
            await self.accept()
        else:
            await self.close()
    
    async def disconnect(self, close_code):
        # Disconnecting user from groups
        if self.own_group_name and self.own_group_name != "":
            await self.channel_layer.group_discard(
                self.own_group_name,
                self.channel_name
            )

        if self.match_group_name and self.match_group_name != "":
            await self.channel_layer.group_discard(
                self.match_group_name,
                self.channel_name
            )
        
        if self.tournament_group_name and self.tournament_group_name != "":
            await self.channel_layer.group_discard(
                self.tournament_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        len_keys = len(data_json.keys())
        if len_keys > 0:
            if "info" in data_json.keys():
                if data_json["info"] == "SEARCHING4":
                    self.check_user_is_present(self.username, remove = True)
                    keys = self.get_slot_4(self.username)
                    self.tournamentkey = keys["tournament_key"]
                    self.roomkey = keys["room_key"]
                    # Define names of each group
                    self.own_group_name = f"{keys["tournament_key"]}{keys["room_key"]}{self.username}"
                    self.match_group_name = f"{keys["tournament_key"]}{keys["room_key"]}"
                    self.tournament_group_name = f"tournament{keys["tournament_key"]}"
                    
                    # Add groups to player
                    await self.channel_layer.group_add(self.own_group_name, self.channel_name)
                    await self.channel_layer.group_add(self.match_group_name, self.channel_name)
                    await self.channel_layer.group_add(self.tournament_group_name, self.channel_name)
                    
                    # Send info back to client
                    message = {"info": "FOUND", "players": TournamentConsumer.four_player_tournaments[keys["tournament_key"]],
                                "results": TournamentConsumer.four_player_tournaments_results[self.tournamentkey]}
                    await self.channel_layer.group_send(
                    self.own_group_name, {"type": "tournament.message", "message": message}
                    )

                    # Update all clients
                    message = {"info": "UPDATE", "players": TournamentConsumer.four_player_tournaments[keys["tournament_key"]],
                        "results": TournamentConsumer.four_player_tournaments_results[self.tournamentkey]}
                    await self.channel_layer.group_send(
                        self.tournament_group_name, {"type": "tournament.message", "message": message}
                    )

                    # Check if tournament is full, and if its full we notify to all players
                    if self.check_tournament_full(keys["tournament_key"]):
                        TournamentConsumer.locked_tournaments.append(keys["tournament_key"])
                        message = {"info": "UPDATE", "tournament_ready": True, "players": TournamentConsumer.four_player_tournaments[keys["tournament_key"]],
                                    "results": TournamentConsumer.four_player_tournaments_results[self.tournamentkey]}
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

                elif data_json["info"] == "MATCH_ENDED":
                    winner = await sync_to_async(Match.get_winner)(f"{self.tournamentkey}{self.roomkey}")
                    winner = str(winner)

                    # If result is already not set, we set it now
                    if TournamentConsumer.four_player_tournaments_results[self.tournamentkey][self.roomkey] == TournamentConsumer.notdefined:
                        print(TournamentConsumer.four_player_tournaments[self.tournamentkey][self.roomkey], flush = True)
                        index_winner = TournamentConsumer.four_player_tournaments[self.tournamentkey][self.roomkey].index(winner)
                        TournamentConsumer.matches_played[self.tournamentkey] = TournamentConsumer.matches_played[self.tournamentkey] + 1

                        if index_winner == 0:
                            TournamentConsumer.four_player_tournaments_results[self.tournamentkey][self.roomkey] = TournamentConsumer.first_win
                        else:
                            TournamentConsumer.four_player_tournaments_results[self.tournamentkey][self.roomkey] = TournamentConsumer.second_win

                    if winner == self.username:

                        # First we leave room of earlier match
                        await self.channel_layer.group_discard(
                            self.match_group_name,
                            self.channel_name
                        )
                        # Update match room and join new room
                        self.update_match_winner()
                        self.match_group_name = f"{self.tournamentkey}{self.roomkey}"
                        await self.channel_layer.group_add(self.match_group_name, self.channel_name)


                        message = {"info": "WIN"}
                        await self.channel_layer.group_send(
                            self.own_group_name, {"type": "tournament.message", "message": message}
                        )

                        if TournamentConsumer.matches_played[self.tournamentkey] == 4 or TournamentConsumer.matches_played[self.tournamentkey] == 6:
                            # This means all matches of first round are played
                            await self.channel_layer.group_add(self.match_group_name, self.channel_name)
                            message = {"info": "NEW_ROUND_READY"}
                            await self.channel_layer.group_send(
                            self.match_group_name, {"type": "tournament.message", "message": message}
                            )


                            message = {"info": "UPDATE_YOUR_BUTTON"}
                            await self.channel_layer.group_send(
                                self.own_group_name, {"type": "tournament.message", "message": message}
                            )
                        elif TournamentConsumer.matches_played[self.tournamentkey] == 7:
                            message = {"info" : "TOURNAMENT_WINNER"}
                            await self.channel_layer.group_send(
                                self.own_group_name, {"type": "tournament.message", "message": message}
                            )

                            self.cleanTournament(self.tournamentkey)
                            self.disconnect(4001)

                    else:
                        # winner is the other guy
                        message = {"info": "DEFEAT"}
                        await self.channel_layer.group_send(
                            self.own_group_name, {"type": "tournament.message", "message": message}
                        )
                        # Disconnecting user who has lost
                        self.disconnect(4001)

                elif data_json["info"] == "UPDATE":
                    message = {"info": "UPDATE", "players": TournamentConsumer.four_player_tournaments[self.tournamentkey], 
                        "results": TournamentConsumer.four_player_tournaments_results[self.tournamentkey]}

                    await self.channel_layer.group_send(
                        self.own_group_name, {"type": "tournament.message", "message": message}
                    )
                
                elif data_json["info"] == "NEW_MATCH":
                    # This means client is requesting new match
                    message = {"info": "MATCH_FOUND", "game_key": f"{self.tournamentkey}{self.roomkey}"}
                    await self.channel_layer.group_send(
                    self.match_group_name, {"type": "tournament.message", "message": message}
                    )

                    
                    

    async def tournament_message(self, event):
        message = event["message"]

        await self.send(text_data = json.dumps({"message": message}))

    # Auxiliar methods
    def generate_correct_uuid(self):
        myuuid = uuid4()
        myuuid = str(myuuid)
        myuuid = myuuid.replace("-","")
        return myuuid

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
                            if tournament_key in TournamentConsumer.locked_tournaments:
                                break
                            if remove:
                                number_player = TournamentConsumer.four_player_tournaments[tournament_key][room_key].index(username)
                                
                                if tournament_key in TournamentConsumer.locked_tournaments:
                                    if number_player == 0:
                                        TournamentConsumer.four_player_tournaments_results[tournament_key][room_key] = TournamentConsumer.second_win
                                    else:
                                        TournamentConsumer.four_player_tournaments_results[tournament_key][room_key] = TournamentConsumer.first_win
                                TournamentConsumer.four_player_tournaments[tournament_key][room_key].remove(username)

                            return True
        
        # By defect
        return False


    def check_not_valid_rooms_4(self, room_key):
        if room_key == "sala04" or room_key == "sala05" or room_key == "sala06":
            return True
        return False

    # Creates a tournament and add a username to it, returns tournament_key and room_key
    def create_tournament(self, username):
        myuuid = self.generate_correct_uuid()
        # Defining rooms of my tournament
        TournamentConsumer.four_player_tournaments[myuuid] = {
            "sala00": [],
            "sala01": [],
            "sala02": [],
            "sala03": [],
            "sala04": [],
            "sala05": [],
            "sala06": [],
        }

        # Defining results of tournament created, undefined at the beginning
        TournamentConsumer.four_player_tournaments_results[myuuid] = {
            "sala00": TournamentConsumer.notdefined,
            "sala01": TournamentConsumer.notdefined,
            "sala02": TournamentConsumer.notdefined,
            "sala03": TournamentConsumer.notdefined,
            "sala04": TournamentConsumer.notdefined,
            "sala05": TournamentConsumer.notdefined,
            "sala06": TournamentConsumer.notdefined
        }

        TournamentConsumer.matches_played[myuuid] = 0

        TournamentConsumer.four_player_tournaments[myuuid]["sala00"].append(username)
        return {"tournament_key": myuuid, "room_key": "sala00"}

    def get_slot_4(self, username):
        tournament_keys = TournamentConsumer.four_player_tournaments.keys()

        # Check number of tournament keys
        if len(tournament_keys) <= 0:
            # Create tournaments if there is no one active
            return self.create_tournament(username)

        elif len(tournament_keys) > 0:
            for tournament_key in tournament_keys:
                # Get room ids
                room_keys = TournamentConsumer.four_player_tournaments[tournament_key].keys()
                if len(room_keys) > 0:
                    for room_key in room_keys:
                        if len(TournamentConsumer.four_player_tournaments[tournament_key][room_key]) < 2 and not self.check_not_valid_rooms_4(room_key):
                            TournamentConsumer.four_player_tournaments[tournament_key][room_key].append(username)
                            return {"tournament_key": tournament_key, "room_key": room_key}
            # Create tournament if there is no slot for my user
            return self.create_tournament(username)


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

    def update_match_winner(self):
        print(self.roomkey, flush = True)
        print(TournamentConsumer.four_player_tournaments[self.tournamentkey], flush = True)
        if self.roomkey == "sala00":
            if len(TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala04"]) == 0:
                TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala04"].append(self.username)
            else:
                TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala04"].insert(0, self.username)
            self.roomkey = "sala04"

        elif self.roomkey == "sala01":
            TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala04"].append(self.username)
            self.roomkey = "sala04"

        elif self.roomkey == "sala02":
            if len(TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala05"]) == 0:
                print("Entro", flush = True)
                TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala05"].append(self.username)
            else:
                TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala05"].insert(0, self.username)
            self.roomkey = "sala05"

        elif self.roomkey == "sala03":
            TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala05"].append(self.username)
            self.roomkey = "sala05"

        elif self.roomkey == "sala04":
            if len(TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala06"]) == 0:
                TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala06"].append(self.username)
            else:
                TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala06"].insert(self.username)
            self.roomkey = "sala06"

        elif self.roomkey == "sala05":
            TournamentConsumer.four_player_tournaments[self.tournamentkey]["sala06"].append(self.username)
            self.roomkey = "sala06"

    def cleanTournament(self, tournament_key):
        del TournamentConsumer.four_player_tournaments[self.tournamentkey]
        del TournamentConsumer.matches_played[self.tournamentkey]
        del TournamentConsumer.four_player_tournaments_results[self.tournamentkey]
        TournamentConsumer.locked_tournaments.remove(self.tournamentkey)