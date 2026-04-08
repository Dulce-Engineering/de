// service-worker.js

console.log('Service worker installation started.');

const CACHE_NAME = 'tempustrak-v1';
const urlsToCache = 
[
  '/app/tempustrak',
  '/app/tempustrak/index.html',
];

async function installServiceWorker(event) 
{
  try 
  {
    const cache = await caches.open(CACHE_NAME);
    console.log('Opened cache');
    await cache.addAll(urlsToCache);
  } 
  catch (error) 
  {
    console.error('Cache installation failed:', error);
  }
}

async function fetchFromCacheOrNetwork(event) 
{
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

async function activateServiceWorker(event) 
{
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

self.addEventListener('install', (event) => {event.waitUntil(installServiceWorker(event));});

self.addEventListener('fetch', (event) => {event.respondWith(fetchFromCacheOrNetwork(event));});

self.addEventListener('activate', (event) => {event.waitUntil(activateServiceWorker(event));});
