import json
from chat.models import Chat, Message
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
        user = self.scope["user"]

        # Recuperar mensajes anteriores de la base de datos de forma asíncrona
        messages = await sync_to_async(Message.objects.filter)(chat_id=self.chat_id)
        message_history = await sync_to_async(get_messages)(messages)

        await self.send(text_data=json.dumps({"message_history": message_history,
                                              "user": user.username,
                                              "chat_id": self.chat_id,
                                              }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json["message"]
        room_name = text_data_json.get("room_name")
        sender = self.scope["user"]
        if self.chat_id and message_content != "":
            message_object = await sync_to_async(Message.create)(self.chat_id, message_content, sender)
            message_id = message_object.id
            # self.chat_id, sender comprobar quien no es el sender
            await self.update_unread_field(sender.username)

            await self.channel_layer.group_send(
                self.room_group_name, {
                    "type": "chat_message",
                    "message": message_content,
                    "message_id": message_id,
                    "sender": sender.username,
                    }
            )


    async def update_unread_field(self, sender_username):
        chat = await sync_to_async(Chat.objects.select_related('player_a', 'player_b').get)(id=self.chat_id)

        player_a = chat.player_a.username
        player_b = chat.player_b.username

        if player_a:
            if sender_username == player_a:
                chat.unread_B = True
        elif player_b:
            if sender_username == player_b:
                chat.unread_A = True
        
        await sync_to_async(chat.save)()


    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        sender = event["sender"]
        message_id = event["message_id"]
        user = self.scope["user"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "message": message,
            "sender": sender,
            "message_id": message_id,
            "user": user.username,
            "chat_id": self.chat_id,
        }))