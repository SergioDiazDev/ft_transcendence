from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

from PIL import Image, ImageOps

# Create your models here.

class Player(AbstractUser):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    username = models.CharField(max_length = 10, unique = True)
    email = models.EmailField(unique = True)
    avatar = models.ImageField(upload_to="static/img/avatars/", default = "static/img/avatars/default.png")
    registerDate = models.DateField(auto_now_add = True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        img = Image.open(self.avatar.name)
        if img.height > 300 or img.width > 300:
            thumb = ImageOps.fit(img, (300, 300))
            thumb.save(self.avatar.name)

class PlayerFriend(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    myUser = models.ForeignKey("Player", on_delete=models.DO_NOTHING, related_name = "my_user")
    myFriend = models.ForeignKey("Player", on_delete=models.DO_NOTHING, related_name = "my_friend")
    status = models.BooleanField(default = False)
    block = models.BooleanField(default = False)
    registerDate = models.DateField(auto_now_add = True)

    @classmethod
    def search_or_create(cls, player_a, player_b):

        player1 = Player.objects.filter(username__exact=player_a).first()
        player2 = Player.objects.filter(username__exact=player_b).first()

        if player1 is None or player2 is None:
            return None

        makeFriend = PlayerFriend.objects.filter(myUser__exact=player1, myFriend__exact=player2) | \
                     PlayerFriend.objects.filter(myUser__exact=player2, myFriend__exact=player1)
        print(makeFriend, flush=True)
        if len(makeFriend) == 0:
            makeFriend = PlayerFriend.objects.create(myUser=player1, myFriend=player2)
            print("Se crea", flush=True)
        else:
            makeFriend = makeFriend.first()
            print("Se encuentra", flush=True)
        
        return makeFriend