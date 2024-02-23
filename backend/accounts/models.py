from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from config.settings import AVATARS_PATH
import uuid

from PIL import Image, ImageOps

# Create your models here.

class Player(AbstractUser):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    username = models.CharField(max_length = 10, unique = True)
    email = models.EmailField(unique = True)
    avatar = models.ImageField(upload_to="avatars/", default = "default.png")
    registerDate = models.DateField(auto_now_add = True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        img = Image.open(AVATARS_PATH + self.avatar.name)
        if img.height > 300 or img.width > 300:
            thumb = ImageOps.fit(img, (300, 300))
            thumb.save(AVATARS_PATH + self.avatar.name)

class PlayerFriend(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    myUser = models.ForeignKey("Player", on_delete=models.DO_NOTHING, related_name = "my_user")
    myFriend = models.ForeignKey("Player", on_delete=models.DO_NOTHING, related_name = "my_friend")
    status = models.BooleanField(default = False)
    registerDate = models.DateField(auto_now_add = True)