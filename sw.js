/* ============================================================
   CHEF IGOR — Service Worker
   Versione cache: chef-igor-v1.0.0
   Strategia: cache-first per asset statici
   Regola critica: NON intercettare mai script.google.com
============================================================ */

const CACHE_NAME = 'chef-igor-v1.0.1';

// Asset da mettere in cache all'installazione
const ASSET_DA_CACHARE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// URL da NON intercettare mai — passano sempre dalla rete
const BYPASS_URLS = [
  'script.google.com',
  'script.googleusercontent.com',
];

/* --- Installazione: pre-carica gli asset --- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSET_DA_CACHARE);
    })
  );
  // Attiva subito senza aspettare che le vecchie tab si chiudano
  self.skipWaiting();
});

/* --- Attivazione: elimina cache vecchie --- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(nomi => {
      return Promise.all(
        nomi
          .filter(nome => nome !== CACHE_NAME)
          .map(nome => caches.delete(nome))
      );
    })
  );
  // Prende controllo di tutte le tab aperte subito
  self.clients.claim();
});

/* --- Fetch: cache-first per asset, bypass per GAS --- */
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Bypass completo per chiamate GAS — vanno sempre in rete
  if (BYPASS_URLS.some(dominio => url.includes(dominio))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Solo richieste GET entrano in cache
  if (event.request.method !== 'GET') return;

  // Cache-first: cerca in cache, se non c'è va in rete e aggiorna cache
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Salva in cache solo risposte valide
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Rete non disponibile e non in cache — restituisce index.html come fallback
        return caches.match('./index.html');
      });
    })
  );
});
