from .models import Player
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class UserRegistrationView(APIView):
    def post(self, request, format = None):
        print(request.POST)
        return Response(status.HTTP_200_OK)