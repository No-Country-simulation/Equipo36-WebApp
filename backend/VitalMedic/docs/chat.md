# Real-time Chat (STOMP over WebSocket)

- WebSocket endpoint: `/ws-chat` (SockJS enabled)
- App destination prefix: `/app`
- Broker destinations: `/topic`, `/queue`
- Room topic pattern: `/topic/chat.{roomId}`

Room format (DB-validated):
- `roomId` must be `{patientUUID}_{doctorUUID}`.
- The server checks both exist in DB and that the sender is one of them.

Connect using SockJS + STOMP from the frontend:

```js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const socket = new SockJS(`${API_BASE}/ws-chat`);
const client = new Client({ webSocketFactory: () => socket });

client.onConnect = () => {
  const roomId = 'patient123_doctor456';
  client.subscribe(`/topic/chat.${roomId}`, (msg) => {
    const payload = JSON.parse(msg.body);
    console.log('Incoming:', payload);
  });

  client.publish({
    destination: '/app/chat.send',
    body: JSON.stringify({
      roomId,
      senderId: 'patient123',
      senderName: 'Jane Doe',
      content: 'Hello doctor!',
      type: 'CHAT'
    })
  });
};

client.activate();
```

Payload shape (`ChatMessage`):

```
{
  roomId: string,
  senderId: string,
  senderName?: string,
  content: string,
  type: 'CHAT' | 'JOIN' | 'LEAVE',
  timestamp: string (ISO) // server-filled
}
```

Security: the WebSocket handshake path `/ws-chat/**` is open by default. If you need JWT-enforced WebSocket authentication, we can add a channel interceptor to validate `Authorization` during the STOMP CONNECT frame.

## Swagger Bridge (HTTP -> STOMP)

You can publish messages via REST for quick testing in Swagger UI (requires Bearer token):

- Endpoint: `POST /api/chat/send`
- Body example:

```
{
  "roomId": "<patientUUID>_<doctorUUID>",
  "content": "Hello from Swagger",
  "type": "CHAT"
}
```

Notes:
- Do not set `senderId`/`senderName`; the server fills them from the authenticated user and DB.
- Clients subscribed to `/topic/chat.<patientUUID>_<doctorUUID>` will receive the message.
- The server adds `timestamp` automatically if omitted.
