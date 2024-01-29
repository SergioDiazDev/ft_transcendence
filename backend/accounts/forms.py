
from django.forms import ModelForm
from .models import Player

class RegisterForm(ModelForm):
    class Meta():
        model = Player
        fields = ["nick", "email", "password"]
