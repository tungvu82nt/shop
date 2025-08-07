// Service Worker cho Yapee PWA
const CACHE_NAME = 'yapee-v1.0.0';
const STATIC_CACHE_NAME = 'yapee-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'yapee-dynamic-v1.0.0';
const IMAGE_CACHE_NAME = 'yapee-images-v1.0.0';

// Các file tĩnh cần cache
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Các route cần cache
const CACHED_ROUTES = [
  '/',
  '/search',
  '/products',
  '/wishlist',
  '/profile',
  '/cart'
];

// Cài đặt Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.filter(url => url !== '/'));
      }),
      // Cache shell
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.add('/');
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      // Kích hoạt ngay lập tức
      return self.skipWaiting();
    })
  );
});

// Kích hoạt Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    Promise.all([
      // Xóa cache cũ
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== IMAGE_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim tất cả clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete');
      // Thông báo có cập nhật mới
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            version: CACHE_NAME
          });
        });
      });
    })
  );
});

// Xử lý fetch requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Chỉ xử lý requests từ cùng origin
  if (url.origin !== location.origin) {
    return;
  }
  
  // Xử lý các loại request khác nhau
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (request.destination === 'document') {
    event.respondWith(handleDocumentRequest(request));
  } else if (request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

// Xử lý requests cho hình ảnh
async function handleImageRequest(request) {
  try {
    // Kiểm tra cache trước
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch từ network
    const networkResponse = await fetch(request);
    
    // Cache hình ảnh nếu thành công
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Image request failed:', error);
    // Trả về placeholder image nếu có
    return new Response('', { status: 404 });
  }
}

// Xử lý requests cho documents (HTML)
async function handleDocumentRequest(request) {
  try {
    // Network first cho documents
    const networkResponse = await fetch(request);
    
    // Cache response nếu thành công
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Document request failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to app shell
    const shellResponse = await caches.match('/');
    if (shellResponse) {
      return shellResponse;
    }
    
    // Offline page
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Yapee - Offline</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .offline { color: #666; }
        </style>
      </head>
      <body>
        <div class="offline">
          <h1>🔌 Không có kết nối internet</h1>
          <p>Vui lòng kiểm tra kết nối mạng và thử lại.</p>
          <button onclick="window.location.reload()">Thử lại</button>
        </div>
      </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' },
        status: 200
      }
    );
  }
}

// Xử lý API requests
async function handleApiRequest(request) {
  try {
    // Network first cho API
    const networkResponse = await fetch(request);
    
    // Cache GET requests nếu thành công
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] API request failed:', error);
    
    // Chỉ fallback cache cho GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Trả về error response
    return new Response(
      JSON.stringify({
        error: 'Network unavailable',
        message: 'Không có kết nối internet. Vui lòng thử lại sau.'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Xử lý static requests
async function handleStaticRequest(request) {
  try {
    // Cache first cho static assets
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch từ network
    const networkResponse = await fetch(request);
    
    // Cache nếu thành công
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Static request failed:', error);
    return new Response('', { status: 404 });
  }
}

// Xử lý background sync
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Thực hiện background sync
async function doBackgroundSync() {
  try {
    // Sync dữ liệu offline
    console.log('[SW] Performing background sync');
    // Implement sync logic here
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Xử lý push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Bạn có thông báo mới từ Yapee',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Xem ngay',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Đóng',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Yapee', options)
  );
});

// Xử lý click notification
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Cleanup cache định kỳ
setInterval(() => {
  cleanupCache();
}, 24 * 60 * 60 * 1000); // Mỗi 24 giờ

async function cleanupCache() {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const requests = await cache.keys();
    
    // Xóa cache cũ hơn 7 ngày
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const request of requests) {
      const response = await cache.match(request);
      const dateHeader = response.headers.get('date');
      
      if (dateHeader) {
        const responseDate = new Date(dateHeader).getTime();
        if (responseDate < oneWeekAgo) {
          await cache.delete(request);
        }
      }
    }
    
    console.log('[SW] Cache cleanup completed');
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error);
  }
}