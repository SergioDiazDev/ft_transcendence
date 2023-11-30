from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers, status

from django.middleware.csrf import get_token

class CSRFTokenSerializer(serializers.Serializer):
    token = serializers.CharField()

# Create your views here.
class ObtainTokenView(APIView):

    def get(self, request, *args, **kwargs):

        token = get_token(request)
        token_data = {
                'token': token
            }

        token_serializer =  CSRFTokenSerializer(data = token_data)
        token_serializer.is_valid(raise_exception = True)
        response_data = token_serializer.data

        return Response(response_data, status = status.HTTP_200_OK)