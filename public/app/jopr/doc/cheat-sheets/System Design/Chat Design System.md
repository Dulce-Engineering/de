Designing a chat system (WhatsApp, Slack, Discord, Messenger) often catches experienced engineers off guard because it breaks the fundamental assumption of modern web architecture: **statelessness**.

HTTP request-response is pull-based and stateless. Real-time chat requires persistent, bidirectional connections where the server pushes messages to recipients with millisecond latency.

Here is how to adapt the master skeleton to ace the chat prompt.

---

### The Architecture Diagram

```
[ User A (Sender) ]                                               [ User B (Receiver) ]
        │                                                                  ▲
        │ (1. Send Message via WSS)                                        │ (5. Push Message via WSS)
        ▼                                                                  │
┌─────────────────────────────────┐                              ┌─────────────────────────────────┐
│     [ Chat Gateway 1 ]          │                              │     [ Chat Gateway 2 ]          │
│ (Stateful WebSocket Server)     │                              │ (Stateful WebSocket Server)     │
└───────────────┬─────────────────┘                              └─────────────────▲───────────────┘
                │                                                                  │
                │ (2. Check recipient location)                                    │ (4. Route to Gateway 2)
                ▼                                                                  │
      [ Session / Presence Store ] ────────────────────────────────────────────────┘
         (Redis: user_id -> gateway_ip)
                │
                │ (3. Save & Fan-out Event)
                ├─────────────────────────────────────────┐
                ▼                                         ▼
   [ Message Store (Cassandra) ]                [ Message Broker / MQ ]
    (Append-only, partitioned by                  (Kafka / Redis Pub/Sub)
             channel_id)                                  │
                                                          ▼
                                              [ Notification Service ]
                                              (FCM / APNs for offline users)

```

---

### The 4 Crucial Shifts from the Master Skeleton

When tailoring your standard boxes for chat, highlight these four specific architectural modifications:

#### 1. The Gateway Must Be Stateful (WebSockets)

Instead of standard HTTP REST calls through an API Gateway, chat uses **WebSockets** (or gRPC streaming) over TLS (`wss://`).

* Once the client authenticates via standard HTTP, the connection upgrades to a persistent WebSocket.
* A single server can hold tens of thousands of idle socket connections concurrently using an event-driven I/O loop (epoll/kqueue).

#### 2. The Session & Presence Registry (The Missing Piece)

If User A is connected to **Chat Gateway 1**, and User B is connected to **Chat Gateway 2**, how does Gateway 1 get the message to User B?

You introduce an in-memory session registry (usually a Redis Cluster):

* **When a user connects:** Gateway 1 writes to Redis: `SET user:B:conn gateway-node-2 TTL 60s`.
* **Heartbeats:** The client sends ping/pong pulses every 30 seconds to refresh the TTL. If it expires, the user is marked **Offline**.
* **Routing:** When User A sends a message to User B, Gateway 1 queries Redis: *"Where is User B?"* $\to$ finds `gateway-node-2` $\to$ forwards the message over internal RPC or Pub/Sub.

#### 3. The Database Choice: Wide-Column / LSM Trees over SQL

Chat message history has a very distinct access pattern:

* Massive write volume (billions of messages a day).
* Reads are almost exclusively sequential range queries: *"Get the last 50 messages in Channel X ordered by time."*
* Messages are immutable; users rarely edit past messages, and they never update them concurrently.

**The Answer:** A distributed wide-column store like **Apache Cassandra** or **ScyllaDB**.

* **Partition Key:** `conversation_id` (keeps all messages for a 1-on-1 or group chat on the same cluster node).
* **Clustering Key:** `message_id` (a time-sortable 64-bit ID, such as a Snowflake ID, sorted descending).
* **Query:** `SELECT * FROM messages WHERE conversation_id = ? ORDER BY message_id DESC LIMIT 50;` — executed as an efficient contiguous disk read.

#### 4. The Offline Path (Push Notifications)

If the Redis Session Store says User B is offline (no active WebSocket), the Chat Gateway drops an event into a queue (Kafka/SQS) consumed by a **Notification Service**.

* The worker formats the payload and talks to Apple Push Notification service (**APNs**) or Firebase Cloud Messaging (**FCM**) to ping the mobile OS.

---

### Handling the Interviewer’s Favorite Gotchas

Interviewers almost always press on two specific edge cases during this interview:

#### A. Message Ordering Across Distributed Devices

* **The Trap:** Relying on client-side timestamps or server wall clocks (`DateTime.UtcNow`). Network lag means client clocks are out of sync, and NTP clock drift across servers will invert message order.
* **The Solution:** Use 64-bit monotonically increasing, time-sortable IDs (like **Twitter Snowflake** or **ULID**). Each message ID embeds timestamp bits, a machine ID, and an auto-incrementing sequence counter. The database clusters and displays messages strictly by this ID.

#### B. 1-on-1 vs. Group Chat (Fan-out Limits)

* **Small Groups (< 100 members, e.g., WhatsApp/Slack):**
* Use **Fan-out on Write**. When a user speaks, the server copies the message pointer to each member's inbox or routes it to each member’s active WebSocket connection directly.


* **Massive Groups (thousands of users, e.g., Discord/Twitch streams):**
* Do **NOT** fan out per user. Use a **Pub/Sub topic per channel** (via Redis Pub/Sub, Kafka, or Pulsar). Gateways subscribe to the channels their connected users are actively viewing. When a message is sent, the gateway broadcasts it only to the clients currently focused on that viewport.



---

### Delivery Script (4-Step Whiteboard Narrative)

1. **Connection Establishment:** *"Clients authenticate via standard HTTPS, then upgrade to persistent WebSockets managed by our stateful Chat Gateway tier."*
2. **Session Lookup:** *"When User A sends a message to User B, Gateway 1 checks our Redis Session Store to see which gateway holds User B's live socket. If found, it routes it internally over gRPC/Pub-Sub to Gateway 2, which pushes it down to User B."*
3. **Storage & Durability:** *"Concurrently, the message is persisted to an append-only Cassandra cluster partitioned by `conversation_id` and clustered by a monotonic Snowflake `message_id` for fast pagination."*
4. **Offline Fallback:** *"If User B has no active session in Redis, an event is placed on our background queue for the Push Notification service to alert them via APNs/FCM."*