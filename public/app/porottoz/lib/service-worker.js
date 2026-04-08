
const CACHE_NAME = 'porottoz-v1';

async function Install_SW(event) 
{
  console.log("Install_SW()");
  const cache = await caches.open("porottoz");
  await cache.addAll
  (
    [
      "/app/porottoz/", 
      "/app/porottoz/index.html", 
    ]
  );
}

async function Activate_SW(event) 
{
  console.log("Activate_SW()");
  const cacheWhitelist = [CACHE_NAME];
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(async (cacheName) => {
      if (cacheWhitelist.indexOf(cacheName) === -1) {
        await caches.delete(cacheName);
      }
    })
  );
}

async function Fetch_SW(event) 
{
  console.log("Fetch_SW()");
  try {
    const response = await caches.match(event.request);
    if (response) {
      return response;
    }
    const networkResponse = await fetch(event.request);
    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
      return networkResponse;
    }
    const responseToCache = networkResponse.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put(event.request, responseToCache);
    return networkResponse;
  } catch (error) {
    console.error('Fetch failed:', error);
    // You might want to return a fallback response here
  }
}

self.addEventListener('install', (event) => {event.waitUntil(Install_SW(event));});
self.addEventListener('activate', (event) => {event.waitUntil(Activate_SW(event));});
self.addEventListener('fetch', (event) => {event.respondWith(Fetch_SW(event));});

