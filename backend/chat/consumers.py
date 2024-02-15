import json
from chat.models import Chat
from chat.models import Message
from django.shortcuts import redirect

from channels.generic.websocket import AsyncWebsocketConsumer

from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["room_name"]
        # Unirse a la sala de chat
        self.room_group_name = "chat_%s" % self.chat_id
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        room_name = text_data_json.get("room_name")

        if self.chat_id:
            await sync_to_async(Message.create)(self.chat_id, message)

        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # deberia de recuperar los mensajes de la bd pendientes

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))