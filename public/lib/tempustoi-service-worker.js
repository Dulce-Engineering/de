
this.addEventListener("fetch", On_Fetch);

this.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open("tempustoi")
      .then((cache) =>
        cache.addAll([
          "/tempustoi/", 
          "/tempustoi/index.html", 
          "/dedial/dedial.js", 
          "/component/DeInputPeriod/index.js", 
          "/audio/alarm-1.wav",
          'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Roboto+Slab:wght@100..900&family=Rye&family=Slabo+27px&display=swap',
        ]),
      ),
  );
});

async function On_Fetch(event)
{
  let response = await caches.match(event.request);
  if (response)
  {
    console.log("Cache hit: " + event.request.url);
  }
  else
  {
    response = fetch(event.request);
    console.log("Cache miss: " + event.request.url);
  }
  event.respondWith(response);
}