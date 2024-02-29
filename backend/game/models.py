from django.db import models
from accounts.models import Player
import uuid

# Create your models here.

class Match(models.Model):
    player1 = models.ForeignKey(Player, related_name="player1", on_delete=models.CASCADE)
    player2 = models.ForeignKey(Player, related_name="player2", on_delete=models.CASCADE)
    player1_score = models.PositiveSmallIntegerField(default=0)
    player2_score = models.PositiveSmallIntegerField(default=0)
    winner = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="game_winner",
                               blank=True, null=True)
    game_url = models.CharField(max_length = 100)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    match_ended = models.BooleanField(default = False)
	# TODO: add the tournament ID when we have tournaments implemented

    @classmethod
    def create_match(cls, player1_name, player2_name, game_id):
        # create the AI player if it doesn't exist
        if player2_name == "AI" and not Player.objects.filter(username='AI').exists():
            ai_player = Player.objects.create_user(username='AI', password=str(uuid.uuid4()),
                                                   avatar="ai.jpg")
            ai_player.save()

        player1 = Player.objects.get(username__exact=player1_name)
        player2 = Player.objects.get(username__exact=player2_name)

        match = cls.objects.create(player1=player1, player2=player2, game_url=game_id)
        return match.id

    @classmethod
    def update_match(cls, match_id, player1_score, player2_score):
        match = cls.objects.get(id=match_id)
        match.player1_score = player1_score
        match.player2_score = player2_score

        match.save()

    @classmethod
    def end_match(cls, match_id, player1_score, player2_score):
        match = cls.objects.get(id=match_id)
        match.player1_score = player1_score
        match.player2_score = player2_score

        if player1_score > player2_score:
            match.winner = match.player1
        elif player2_score > player1_score:
            match.winner = match.player2
        match.match_ended = True
        match.save()

    @classmethod
    def get_match_pictures(cls, match_id):
        match = cls.objects.get(id=match_id)
        return (match.player1.avatar.name, match.player2.avatar.name)

    @classmethod
    def get_winner(cls, game_key):
        matches = cls.objects.filter(game_url=game_key)
        match = matches.last()
        if not match:
            return None

        if match.match_ended == True:
            # if winner is 1 return a 1
            if match.player1_score > match.player2_score:
                return match.player1
            else:
                # winner is 2 return a 2
                return match.player2