from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.

class Player(AbstractUser):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    nick = models.CharField(max_length = 100, unique = True)
    email = models.EmailField(max_length = 100)
    password = models.CharField(max_length = 100)
    avatar = models.CharField(max_length = 100)
    registerDate = models.DateField(auto_now_add = True)