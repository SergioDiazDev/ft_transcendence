from django.urls import path

from . import views

urlpatterns = [
	path("<str:game_id>/", views.index, name="index_default"),
	path("<str:game_id>/<int:vs_ai>", views.index, name="index"),
]