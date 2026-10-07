Almost every system design interview question—whether it is a URL shortener, a ride-sharing service, or a social feed—can be solved on the exact same structural backbone.

Think of this as the **Master Skeleton**. Once you drop this template onto the board, you have hit 80% of the interviewer's grading rubric. From there, you only need to customize the data model and the async workers for the specific prompt.

---

### The Universal Architecture Diagram

```
                        [ Client / App ]
                                │
                                ▼
                       [ 1. Edge & DNS ]
                       (Cloudflare / Route53)
                                │
                  ┌─────────────┴─────────────┐
                  │ (Static Assets / Media)   │ (Dynamic API Traffic)
                  ▼                           ▼
            [ 2. CDN ]               [ 3. Load Balancer ]
            (CloudFront/Akamai)      (Nginx / AWS ALB)
                                              │
                                              ▼
                                     [ 4. API Gateway ]
                                     (Auth, Rate Limiting)
                                              │
                                              ▼
                                 [ 5. Application Servers ]
                                 (Stateless Service Fleet)
                                              │
             ┌────────────────────────────────┼────────────────────────────────┐
             ▼                                ▼                                ▼
    [ 6. In-Memory Cache ]          [ 7. Primary Storage ]           [ 8. Message Broker ]
       (Redis / Memcached)          (Postgres / DynamoDB)              (Kafka / SQS / RabbitMQ)
             │                                │                                │
             │ (Read-aside / Write-through)   │ (Master-Replica / Shards)      ▼
             └────────────────────────────────┘                     [ 9. Background Workers ]
                                                                       (Async Consumers)
                                                                               │
                                                                               ▼
                                                                     [ 10. Secondary Stores ]
                                                                     (S3 Blobs / Elasticsearch)

```

---

### The 10 "Standard Suspects" (And Why They Are There)

When drawing this, briefly state the purpose of each tier using standard architectural shorthand:

| Tier | Component | Exact Role on the Rubric |
| --- | --- | --- |
| **1. Ingress** | **DNS & Anycast** | Resolves the domain to the nearest data center IP address. |
| **2. Edge Cache** | **CDN** | Serves static content (HTML, JS, images, video segments) geographically close to the user; shields backend from read volume. |
| **3. Distribution** | **Load Balancer (LB)** | Health checks instances, terminates TLS/SSL, distributes traffic across backend servers (Round Robin, Least Connections). |
| **4. Perimeter** | **API Gateway** | Handles cross-cutting concerns: token validation (JWT), rate limiting/throttling (Token Bucket algorithm), and path routing. |
| **5. Compute** | **Stateless App Tier** | Runs business logic. **Must be stateless** (sessions stored in Redis/JWT) so instances can auto-scale horizontally behind the LB. |
| **6. Read Accelerator** | **Cache (Redis)** | High-throughput, sub-millisecond reads for hot data (user profiles, session states, trending items) using a *Cache-Aside* pattern. |
| **7. System of Record** | **Primary Database** | Holds authoritative state. SQL for relations and ACID compliance (Postgres); NoSQL for horizontal scale and high write-volume (DynamoDB/Cassandra). Read-replicas split read traffic from writes. |
| **8. Decoupler** | **Message Queue / Stream** | Absorbs high-volume writes, protects slow downstream systems from spikes, decouples long-running jobs (video encoding, push notifications, fan-outs). |
| **9. Compute (Async)** | **Worker Fleet** | Consumes events off the queue at its own pace. Idempotent processing ensures retries do not cause duplicate operations. |
| **10. Specialized Stores** | **Search & Blobs** | Unstructured large files (images, raw logs) go directly to **Object Storage (S3)**; full-text search goes to an inverted-index store (**Elasticsearch/OpenSearch**). |

---

### How to Deliver This in 5 Minutes

To avoid the interviewer thinking you are stalling, draw and narrate this in four quick passes:

1. **Pass 1: The Request Path (1 minute)**
Draw: `Client -> Load Balancer -> App Server -> Database`.
*Script:* *"Starting with the baseline: traffic hits the load balancer, which distributes requests across our stateless application servers, writing to and reading from our primary database."*
2. **Pass 2: The Read Optimizations (1 minute)**
Add: `CDN` at the top, `Redis Cache` next to the DB.
*Script:* *"Since systems of this type are heavily read-biased, we place a CDN at the edge for static/cached responses, and an in-memory Redis cache using a cache-aside pattern to shield the database from read hotspots."*
3. **Pass 3: The Write & Async Path (1 minute)**
Add: `Message Queue -> Workers -> External Stores/DB`.
*Script:* *"For expensive or non-blocking operations—like analytics, notifications, or heavy processing—the app servers publish events to a message queue so our workers can process them asynchronously without increasing client latency."*
4. **Pass 4: Protection & Scale (1 minute)**
Add: `API Gateway` (rate limiting) and DB `Read Replicas`.
*Script:* *"Finally, we enforce rate limiting and authentication at the API Gateway to prevent abuse, and add database read replicas with a primary-replica topology to scale out reads."*

---

Once this 10-box skeleton is visible, you have checked off the baseline requirements for scale, availability, and tier separation.

From that point forward, the prompt becomes trivial: you just point to the skeleton and say, *"Now, let's tailor the data model inside our database and the exact payloads passing through this queue to solve the specific problem."*