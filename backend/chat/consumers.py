import json
from chat.models import Chat
from chat.models import Message
from django.shortcuts import redirect
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

def get_messages(messages):
    return [{'message': message.content, 'sender': message.sender.username, 'id': message.id, } for message in messages]

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["room_name"]
        # Unirse a la sala de chat
        self.room_group_name = "chat_%s" % self.chat_id
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        
        # Recuperar mensajes anteriores de la base de datos de forma asíncrona
        messages = await sync_to_async(Message.objects.filter)(chat_id=self.chat_id)
        message_history = await sync_to_async(get_messages)(messages)

        await self.send(text_data=json.dumps({"message_history": message_history}))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json["message"]
        room_name = text_data_json.get("room_name")
        sender = self.scope["user"]
        if self.chat_id:
            message_object = await sync_to_async(Message.create)(self.chat_id, message_content, sender)
            message_id = message_object.id

        # Marcar todos los mensajes como leídos para el usuario actual
        await sync_to_async(Message.objects.filter(chat_id=self.chat_id, sender=sender).update)(read=True)

        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "chat_message",
                  "message": message_content,
                  "message_id": message_id,
                  "sender": sender.username,
                }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        sender = event["sender"]
        print(sender)
        message_id = event["message_id"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "message": message,
            "sender": sender,
            "message_id": message_id
        }))