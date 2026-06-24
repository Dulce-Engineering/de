// Define what constitutes a local environment
const isLocal = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1';
const id = "G-KMFPTFXKGX";

if (!isLocal) 
{
  // 1. Dynamically inject the external GA4 script
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(gaScript);

  // 2. Initialize the tracking config
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', id);
} 
else 
{
  // Optional: Helpful reminder in your local console
  console.log('Analytics disabled for local testing.');
}
