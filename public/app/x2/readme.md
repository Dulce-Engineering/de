App to update files in firebase hosting directly.
To be used to inject data into pages for speedy rendering on first load.

Yes. The **Firebase Hosting REST API** gives you precisely this capability: your CMS can trigger a pure, static HTML replacement **at publish time** so the end user's browser fetches a pre-rendered, static HTML file with **zero client-side JavaScript overhead or extra runtime HTTP requests**.

Firebase Hosting uses a **content-addressed store (SHA-256 hashing)**. When your CMS updates a single HTML file, you do **not** need to upload the whole website again. Firebase compares the file hashes of the new deployment against the previous release, uploads **only the modified HTML file**, and reuses the existing byte blobs for all unchanged assets.

---

### How the CMS Direct-Inject Workflow Operates

When a CMS user hits "Publish", your backoffice or webhook executes a 5-step REST flow to publish a new static snapshot:

```
[ CMS Publish ] ──> [ Generate Updated HTML ] ──> [ Firebase Hosting REST API ] ──> [ CDN Cache ]
                                                                                         │
                                                                                 (Pure Static HTML)
                                                                                         │
                                                                                         ▼
                                                                                   [ End User ]

```

#### Step 1: Create a New Site Version

Your CMS makes an authenticated `POST` request to register a new release version in `CREATED` status.

```http
POST https://firebasehosting.googleapis.com/v1beta1/sites/{SITE_ID}/versions
Authorization: Bearer <GCP_SERVICE_ACCOUNT_TOKEN>
Content-Type: application/json

{
  "config": {
    "cleanUrls": true
  }
}

```

#### Step 2: Populate the File Manifest (SHA-256 Handshake)

The CMS calculates the SHA-256 hash of all static files in the site (including the newly injected/modified `index.html`) and sends the mapping to Firebase:

```http
POST https://firebasehosting.googleapis.com/v1beta1/sites/{SITE_ID}/versions/{VERSION_ID}:populateFiles
Authorization: Bearer <GCP_SERVICE_ACCOUNT_TOKEN>
Content-Type: application/json

{
  "files": {
    "/index.html": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "/styles.css": "a1b2c3d4...",
    "/logo.png":   "f5e6d7c8..."
  }
}

```

**What Firebase returns:**
Firebase responds with a `requiredUploads` array listing *only the hashes it does not already have stored*. Because `/styles.css` and `/logo.png` didn't change, Firebase omits them. The array will contain **only the SHA-256 hash of the modified `/index.html**`.

#### Step 3: Upload the Single Modified File

The CMS uploads the raw HTML bytes of the modified file directly to the temporary upload URL returned by the previous step.

```http
POST https://upload-firebasehosting.googleapis.com/v1beta1/upload/sites/{SITE_ID}/versions/{VERSION_ID}/files/{HASH}
Authorization: Bearer <GCP_SERVICE_ACCOUNT_TOKEN>
Content-Type: application/octet-stream

<!DOCTYPE html>
<html>
  <body>
    <!-- CMS-injected HTML content is directly rendered here -->
    <h1>Featured Promo: Summer Sale</h1>
  </body>
</html>

```

#### Step 4: Finalize the Version

Change the status of the version from `CREATED` to `FINALIZED`.

```http
PATCH https://firebasehosting.googleapis.com/v1beta1/sites/{SITE_ID}/versions/{VERSION_ID}?updateMask=status
Authorization: Bearer <GCP_SERVICE_ACCOUNT_TOKEN>
Content-Type: application/json

{
  "status": "FINALIZED"
}

```

#### Step 5: Release to Live CDN

Instantly swap the site's live traffic to point to the newly finalized version.

```http
POST https://firebasehosting.googleapis.com/v1beta1/sites/{SITE_ID}/releases?versionName=sites/{SITE_ID}/versions/{VERSION_ID}
Authorization: Bearer <GCP_SERVICE_ACCOUNT_TOKEN>

```

---

### Why This Meets Your Constraints Exactly

1. **Zero Client Overhead:** The client receives a single, pure, pre-rendered HTML file from the CDN. There is no JavaScript payload, no DOM manipulation, no hydration step, and no extra HTTP requests.
2. **Bandwidth & Speed Efficiency:** The deploy process transfers **only the bytes of the modified file(s)** over the network. A full site update where 1 out of 100 HTML files changed completes in seconds.
3. **Atomic Swaps:** Firebase switches the CDN routing pointer atomically. End users will never see a partially uploaded or broken state during the publish window.