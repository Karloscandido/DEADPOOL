const CACHE_NAME = 'lucsons-team-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './fundo.jpg'
];

// Instala o Service Worker e armazena os arquivos essenciais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto com sucesso!');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Força a atualização imediata
  );
});

// Ativa o Service Worker e limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta as requisições para fazer o app funcionar offline
self.addEventListener('fetch', event => {
  // Não intercepta requisições de APIs externas (como a do Telegram ou IP)
  if (event.request.url.includes('api.telegram.org') || event.request.url.includes('ip-api.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna do cache se encontrar
        }
        return fetch(event.request); // Busca na rede se não estiver no cache
      })
  );
});
