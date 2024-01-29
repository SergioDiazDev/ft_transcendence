from django.urls import path
from .views import ObtainTokenView

urlpatterns = [
    path('csrf_token/', ObtainTokenView.as_view(), name = 'csrf_token'),
]