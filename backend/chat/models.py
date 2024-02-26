from django.db import models
from accounts.models import Player

class Chat(models.Model):
	player_a = models.ForeignKey(Player, related_name="player_a", on_delete=models.CASCADE)
	player_b = models.ForeignKey(Player, related_name="player_b", on_delete=models.CASCADE)
	unread_A = models.BooleanField(default=False)
	unread_B = models.BooleanField(default=False)

	class Meta:
		constraints = [
			models.UniqueConstraint(
				fields=['player_a', 'player_b'], name='unique_player_a_player_b_combination'
			)
		]

	@classmethod
	def search_or_create(cls, player_a, player_b):
		player1 = Player.objects.filter(username__exact=player_a).first()
		player2 = Player.objects.filter(username__exact=player_b).first()
		if player1 is None or player2 is None:
			return None

		chat = Chat.objects.filter(player_a=player1, player_b=player2) | \
				Chat.objects.filter(player_a=player2, player_b=player1)
		
		if len(chat) == 0:
			chat = Chat.objects.create(player_a=player1, player_b=player2)
		else:
			chat = chat.first()
		return chat.id

class Message(models.Model):
	chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
	content = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	sender = models.ForeignKey(Player, on_delete=models.CASCADE)
	class Meta:
		ordering = ['id'] 

	@classmethod
	def create(cls, chat_id, content, sender):
		return Message.objects.create(chat_id=chat_id, content=content, sender=sender)
