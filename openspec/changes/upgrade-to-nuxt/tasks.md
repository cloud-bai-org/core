## 1. Nuxt 專案初始化

- [ ] 1.1 使用 `npx nuxi@latest init` 建立 Nuxt 專案，設定 TypeScript、`nuxt.config.ts` 基本配置
- [ ] 1.2 建立 Nuxt 慣例目錄結構：`app/`（pages、components、composables、middleware、layouts、plugins）與 `server/`（api、routes、middleware、utils）
- [ ] 1.3 設定路徑別名、TypeScript strict mode、開發 scripts（dev、build、generate、preview）

## 2. UI 框架整合

- [ ] 2.1 安裝並設定 `@nuxtjs/tailwindcss` 模組，配置 Tailwind CSS 4
- [ ] 2.2 安裝並設定 `shadcn-nuxt` 模組，設定廟宇莊嚴風格主題配色（絳紅、琉璃金、蒼綠、玄黑背景）
- [ ] 2.3 安裝基礎 shadcn-vue 元件（Button、Input、Dialog、Card 等）至 `app/components/ui/`

## 3. 狀態管理與資料層

- [ ] 3.1 安裝並設定 `@pinia/nuxt` 模組，建立 `stores/` 目錄結構
- [ ] 3.2 安裝 `pinia-plugin-persistedstate` 實現 localStorage 持久化，驗證 SSR 環境下正常運作
- [ ] 3.3 在 `data/` 目錄建立靜態資料結構（temples.json、deities.json、worship-routes.json）與 TypeScript 型別定義

## 4. 渲染策略與路由

- [ ] 4.1 在 `nuxt.config.ts` 設定 `routeRules`：首頁/關於頁 prerender（SSG）、儀式互動頁 SPA mode（`ssr: false`）、API routes 啟用 CORS
- [ ] 4.2 建立基本頁面骨架：`app/pages/index.vue`、`app/pages/worship/index.vue`、`app/pages/temple/index.vue`、`app/pages/profile/index.vue`
- [ ] 4.3 建立 `app/layouts/default.vue` 與 `app/layouts/worship.vue`（儀式專用 layout）

## 5. PWA 配置

- [ ] 5.1 安裝並設定 `@vite-pwa/nuxt` 模組，配置 manifest（應用名稱、圖示、主題色）
- [ ] 5.2 配置 Service Worker 策略（precache + runtime cache），驗證 Service Worker 註冊成功
- [ ] 5.3 配置 Web Notification API 權限請求流程

## 6. 多語系整合

- [ ] 6.1 安裝並設定 `@nuxtjs/i18n` 模組，配置四種語言（zh-TW、en、ja、ko），URL 策略使用 `prefix_except_default`
- [ ] 6.2 建立 `locales/` 目錄結構與基礎翻譯檔，配置 lazy loading 語言包
- [ ] 6.3 實作語言切換 UI 元件與瀏覽器語言自動偵測

## 7. 動畫引擎整合

- [ ] 7.1 建立 Nuxt plugin 註冊 @vueuse/motion（或安裝 `nuxt-motion` 模組）
- [ ] 7.2 安裝 GSAP，建立動畫工具 composable（`app/composables/useAnimation.ts`）
- [ ] 7.3 驗證 @vueuse/motion 的 `v-motion` 指令與 GSAP timeline 動畫在 SPA mode 頁面中正常運作

## 8. Nitro Server API 骨架

- [ ] 8.1 建立 OAuth callback handler 骨架：`server/api/auth/google.get.ts`、`server/api/auth/line.get.ts`
- [ ] 8.2 建立使用者 API 骨架：`server/api/auth/me.get.ts`（取得當前使用者）
- [ ] 8.3 建立儀式紀錄 API 骨架：`server/api/worship/index.post.ts`、`server/api/worship/[id].get.ts`
- [ ] 8.4 建立 WebSocket endpoint 骨架：`server/routes/_ws.ts`（多人拜拜即時同步）

## 9. 測試框架配置

- [ ] 9.1 安裝 Vitest 4.x + `@nuxt/test-utils` + `@vue/test-utils`，設定 `vitest.config.ts`
- [ ] 9.2 撰寫一個範例元件測試與一個範例 API route 測試，驗證測試環境正確

## 10. 功能模組目錄建立

- [ ] 10.1 在 `app/components/` 下建立所有 capability 子目錄（auth、worship、joss-paper、offering、divination、incense、paper-craft、eco-tracker、temple-checkin、group-worship）
- [ ] 10.2 在 `app/composables/` 下建立對應的 composable 檔案骨架
- [ ] 10.3 在 `stores/` 下建立 Pinia store 骨架（useAuthStore、useWorshipStore 等）

## 11. 驗證與收尾

- [ ] 11.1 執行 `pnpm run dev` 驗證開發伺服器正常啟動、HMR 正常運作
- [ ] 11.2 執行 `pnpm run build` 驗證 production build 無錯誤
- [ ] 11.3 驗證 auto-imports 正常（Vue API、composables、components 皆無需手動 import）
- [ ] 11.4 驗證 routeRules 渲染策略正確（SSG 頁面產生靜態 HTML、SPA 頁面不經過 SSR）
