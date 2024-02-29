from django.db import models
from accounts.models import Player
# Create your models here.

class Tournament(models.Model):
    id = models.UUIDField(primary_key=True, default=None, editable=False)
    winner = models.ForeignKey(Player, on_delete=models.DO_NOTHING, related_name="tournament_winner", null=True)
    second = models.ForeignKey(Player, on_delete=models.DO_NOTHING, related_name="tournament_runner_up", null=True)
    