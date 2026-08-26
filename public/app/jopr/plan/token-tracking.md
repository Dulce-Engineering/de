That approach is spot-on. Moving this off the client is essential anyway to protect your API keys and prevent users from manipulating requests or bypassing token tracking.

Tracking `usageMetadata` server-side gives you exact numbers for both input and output tokens per user. Here is how you can set up that pipeline and establish a unit price.

---

### 1. Server-Side Data Collection

When you call Gemini on the backend (Node.js/Firebase Cloud Functions), the SDK returns token usage directly in the response metadata:

```javascript
const result = await model.generateContent(prompt);
const response = await result.response;

// Extract usage numbers
const { promptTokenCount, candidatesTokenCount, totalTokenCount } = response.usageMetadata;

// Log or store in Firestore under the user's account
await db.collection("users").doc(userId).collection("ai_usage").add({
  feature: "Extract_Job",
  model: "gemini-2.5-flash",
  input_tokens: promptTokenCount,
  output_tokens: candidatesTokenCount,
  total_tokens: totalTokenCount,
  created_at: new Date()
});

```

---

### 2. Establishing Your Cost Unit Baseline

Gemini bills input and output tokens at different rates. To set a simple internal price per unit (or compute precise USD costs), convert raw token counts into dollars:

* **Gemini 2.5 Flash Rates:**
* Input: $\$0.30$ / 1,000,000 tokens ($\$0.0000003$ per token)
* Output: $\$2.50$ / 1,000,000 tokens ($\$0.0000025$ per token)



**Formula for exact execution cost:**


$$\text{Cost} = (\text{Input Tokens} \times 0.0000003) + (\text{Output Tokens} \times 0.0000025)$$

If you want a unified "Credits" or "Token Unit" for your UI, scale the cost so users see an intuitive number rather than fractions of a cent (e.g., $1 \text{ Credit} = \$0.001 \text{ USD}$).

---

### 3. Progressive Rollout Plan

**Phase 1: Backend Migration & Silent Tracking**

* Move `AI.js` to Firebase Cloud Functions / backend endpoints.
* Keep JOPR free for yourself and early testers, but write every call's `usageMetadata` to Firestore.

**Phase 2: Self-Monitoring & UI Stats**

* Use JOPR for your own job searches.
* Add a simple admin view or user profile panel showing "Tokens Used This Month" and "Estimated Cost".
* Run 10–20 real CVs and job ads through the engine to get a true statistical average (P50 and P90 token counts per operation).

**Phase 3: Rate Limiting & Auth Checks**

* Add a middleware check to your backend endpoints to enforce limits before calling the Gemini SDK:
* Check user authentication status.
* Check remaining monthly balance or credit quota.
* Reject execution with a `402 Payment Required` or `429 Too Many Requests` status code if exhausted.



---

Would you like to write the Firebase Cloud Function wrapper for `AI.js`, or draft the Firestore schema for logging and user balance tracking first?