const CACHE_NAME = 'stellar-chronicles-v1';
const STATIC_CACHE = 'stellar-chronicles-static-v1';
const DYNAMIC_CACHE = 'stellar-chronicles-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/stories',
  '/data',
  '/manifest.json',
  '/offline.html',
  // Add static assets here
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Serve cached version or offline page
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Serve offline page for navigation requests
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Serve cached API response if available
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline indicator for API requests
              return new Response(
                JSON.stringify({
                  error: 'Offline',
                  message: 'No internet connection. Showing cached data.',
                  timestamp: new Date().toISOString()
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          });
      })
  );
});

// Background sync for space weather data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'space-weather-sync') {
    event.waitUntil(
      syncSpaceWeatherData()
        .then(() => {
          console.log('Service Worker: Space weather data synced');
          // Notify all clients about updated data
          return self.clients.matchAll();
        })
        .then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SPACE_WEATHER_UPDATED',
              timestamp: new Date().toISOString()
            });
          });
        })
    );
  }
});

// Push notifications for space weather alerts
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.message || 'New space weather event detected',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'space-weather-alert',
    data: data,
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Solar Tales Alert',
      options
    )
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      self.clients.openWindow('/data')
    );
  }
});

// Sync space weather data function
async function syncSpaceWeatherData() {
  try {
    const responses = await Promise.allSettled([
      fetch('/api/space-weather/solar-flares'),
      fetch('/api/space-weather/geomagnetic'),
      fetch('/api/space-weather/aurora')
    ]);

    const cache = await caches.open(DYNAMIC_CACHE);
    
    responses.forEach((response, index) => {
      if (response.status === 'fulfilled' && response.value.ok) {
        const endpoints = [
          '/api/space-weather/solar-flares',
          '/api/space-weather/geomagnetic', 
          '/api/space-weather/aurora'
        ];
        cache.put(endpoints[index], response.value.clone());
      }
    });

    return true;
  } catch (error) {
    console.error('Service Worker: Failed to sync space weather data:', error);
    return false;
  }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered');
  
  if (event.tag === 'space-weather-update') {
    event.waitUntil(syncSpaceWeatherData());
  }
});
