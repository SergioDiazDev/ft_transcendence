from django.shortcuts import render
from django.views import View
from .models import Player
from django.http import HttpResponse

# Create your views here.

class UserRegistrationView(View):
    def post(self, request, *args, **kwargs):
        print(request)
        return HttpResponse("ok")
