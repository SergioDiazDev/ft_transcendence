from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.

class Player(AbstractUser):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    username = models.CharField(max_length = 100, unique = True)
    avatar = models.CharField(max_length = 100, default = "default.png")
    registerDate = models.DateField(auto_now_add = True)

class PlayerFriend(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    myUser = models.ForeignKey("Player", on_delete=models.DO_NOTHING, related_name = "my_user")
    myFriend = models.ForeignKey("Player", on_delete=models.DO_NOTHING, related_name = "my_friend")
    status = models.BooleanField(default = False)
    registerDate = models.DateField(auto_now_add = True)