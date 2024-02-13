from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.

class Player(AbstractUser):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    username = models.CharField(max_length = 100, unique = True)
    avatar = models.CharField(max_length = 100, default = "default.png")
    registerDate = models.DateField(auto_now_add = True)