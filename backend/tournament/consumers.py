
from channels.generic.websocket import AsyncWebsocketConsumer

class MatchmakingConsumer(AsyncWebsocketConsumer):

    async def connect(self, *args, **kwargs):
        self.user = self.scope["user"]
        print(self.user)
        await self.accept()
