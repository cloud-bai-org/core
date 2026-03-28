// 焚香計時 Service Worker 擴充
// 由 @vite-pwa/nuxt 的 workbox 配合 importScripts 載入

let incenseTimerId = null

self.addEventListener('message', (event) => {
  const { type, endTime } = event.data || {}

  if (type === 'INCENSE_TIMER_START') {
    if (incenseTimerId) {
      clearTimeout(incenseTimerId)
    }

    const delay = endTime - Date.now()
    if (delay <= 0) {
      showIncenseNotification()
      return
    }

    incenseTimerId = setTimeout(() => {
      showIncenseNotification()
      incenseTimerId = null
    }, delay)
  }

  if (type === 'INCENSE_TIMER_CANCEL') {
    if (incenseTimerId) {
      clearTimeout(incenseTimerId)
      incenseTimerId = null
    }
  }
})

function showIncenseNotification() {
  self.registration.showNotification('線上拜拜', {
    body: '香已燃畢，請回到儀式繼續進行。',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'incense-complete',
    data: {
      url: '/worship/incense',
    },
  })
}

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification
  notification.close()

  if (notification.tag === 'incense-complete') {
    const url = notification.data?.url || '/'
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        for (const client of clients) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus()
          }
        }
        return self.clients.openWindow(url)
      }),
    )
  }
})
