import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    'shadcn-nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/motion/nuxt',
    '@vite-pwa/nuxt',
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['gsap'],
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  pwa: {
    manifest: {
      name: '線上拜拜',
      short_name: '線上拜拜',
      description: '將華人傳統拜拜習俗數位化，以環保方式完成儀式',
      lang: 'zh-TW',
      theme_color: '#1C1919',
      background_color: '#1C1919',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
    },
  },

  // TODO: 待 shadcn-vue SSR 相容性穩定後，可將 / 改為 prerender、/eco-impact 改為 SSR
  ssr: false,

  routeRules: {
    '/': { prerender: true },
    '/login': { ssr: false },
    '/settings': { ssr: false },
    '/worship/**': { ssr: false },
    '/temple/**': { ssr: false },
    '/group/**': { ssr: false },
  },

  css: ['~/assets/css/main.css'],
})
