'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration);

          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  console.log('New service worker version available');
                  
                  // Show update notification
                  if (confirm('A new version of Solar Tales is available. Update now?')) {
                    newWorker.postMessage({ action: 'skipWaiting' });
                    window.location.reload();
                  }
                }
              });
            }
          });

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            const { type, data } = event.data;
            
            switch (type) {
              case 'SPACE_WEATHER_UPDATED':
                console.log('Space weather data updated:', data);
                // Trigger UI update
                window.dispatchEvent(new CustomEvent('spaceWeatherUpdate', { detail: data }));
                break;
                
              case 'CACHE_UPDATED':
                console.log('Cache updated:', data);
                break;
                
              default:
                console.log('Unknown message from service worker:', event.data);
            }
          });

          // Register for background sync if supported
          if ('serviceWorker' in navigator) {
            try {
              // Background sync registration would go here in production
              console.log('Service worker ready for background sync');
            } catch (error) {
              console.log('Background sync not supported');
            }
          }

          // Request notification permission
          if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
          }

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
