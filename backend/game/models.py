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
	# TODO: add the tournament ID when we have tournaments implemented

    @classmethod
    def create_match(cls, player1_name, player2_name):
        # create the AI player if it doesn't exist
        if player2_name == "AI" and not Player.objects.filter(username='AI').exists():
            ai_player = Player.objects.create_user(username='AI', password=str(uuid.uuid4()),
                                                   avatar="ai.jpg")
            ai_player.save()

        player1 = Player.objects.get(username__exact=player1_name)
        player2 = Player.objects.get(username__exact=player2_name)

        match = cls.objects.create(player1=player1, player2=player2)
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

        match.save()

    @classmethod
    def get_match_pictures(cls, match_id):
        match = cls.objects.get(id=match_id)
        return (match.player1.avatar, match.player2.avatar)