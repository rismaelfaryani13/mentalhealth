const CACHE_NAME = 'temanjiwa-v10';
const ASSETS = [
    './index.html',
    './style.css',
    './questionnaire-data.js',
    './app.js',
    './icon.svg',
    './icon-192.png',
    './icon-512.png',
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
        })
    ).then(() => self.skipWaiting());
});

// Activate Event - purge old caches immediately
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

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Fetch Event - Network first for app resources, never cache API responses.
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/api/') || url.pathname.endsWith('save_questionnaire.php') || url.pathname.endsWith('rekap_kuesioner.json')) {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        fetch(event.request).then(networkResponse => {
            if (url.origin !== self.location.origin) {
                return networkResponse;
            }
            if (networkResponse && networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
        }).catch(() => {
            return caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
