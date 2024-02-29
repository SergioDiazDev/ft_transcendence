from django.db import models

from game.models import Game

class Tournament(models.Model):
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	player1 = models.ForeignKey("Player", on_delete=models.DO_NOTHING, related_name = "player1")
	player2 = models.ForeignKey("Player", on_delete=models.DO_NOTHING, related_name = "player2")
	player3 = models.ForeignKey("Player", on_delete=models.DO_NOTHING, related_name = "player3")
	player4 = models.ForeignKey("Player", on_delete=models.DO_NOTHING, related_name = "player4")
	
	semiFinal1 = models.ForeignKey("Game", on_delete=models.DO_NOTHING, related_name = "semiFinal1")
	semiFinal2 = models.ForeignKey("Game", on_delete=models.DO_NOTHING, related_name = "semiFinal2")
	
	final = models.ForeignKey("Game", on_delete=models.DO_NOTHING, related_name = "final")
