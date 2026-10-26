const CACHE_NAME = 'temanjiwa-v1';
const ASSETS = [
    './index.html',
    './style.css',
    './questionnaire-data.js',
    './app.js',
    './icon.svg',
    './manifest.json'
];

// Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            for (const asset of ASSETS) {
                try {
                    await cache.add(asset);
                } catch (e) {
                    console.info('SW asset cache skipped:', asset);
                }
            }
        }).then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event (Cache First, Network Fallback)
self.addEventListener('fetch', event => {
    // Only handle GET requests and http/https schemes
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch(() => {
                // Fallback for offline if request is for document page
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
