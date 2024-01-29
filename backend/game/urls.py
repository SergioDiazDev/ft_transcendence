from django.urls import path

from . import views

urlpatterns = [
	path("<str:game_id>/", views.index, name="index")
]