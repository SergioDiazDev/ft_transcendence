from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Player

class SignupForm(UserCreationForm):
    email = forms.EmailField(max_length=200, help_text="Required")

    class Meta:
        model = Player
        fields = ["username", "email"]

class UpdatePlayerForm(forms.ModelForm):
    email = forms.EmailField(max_length=200)
    avatar = forms.ImageField(widget=forms.FileInput())

    class Meta:
        model = Player
        fields = ["username", "email", "avatar"]