from django.shortcuts import render

from django.views import View
from django.http import HttpResponse
from django.middleware.csrf import get_token

# Create your views here.
class ObtainTokenView(View):
    def get(self, request, *args, **kwargs):
        response = HttpResponse("ok")

        token = get_token(request)
        response.set_cookie("X-CSRFToken",token)
        return response