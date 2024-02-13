from django.db import models
import uuid

# Create your models here.
class PlayerFriend(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    myUser = models.ForeignKey("accounts.Player", on_delete=models.DO_NOTHING, related_name = "my_user")
    myFriend = models.ForeignKey("accounts.Player", on_delete=models.DO_NOTHING, related_name = "my_friend")
    status = models.BooleanField(default = False)
    registerDate = models.DateField(auto_now_add = True)