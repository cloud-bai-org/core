## Context

目前專案規劃使用 Vue 3 + Vite 7 作為純前端 SPA，搭配大量 unplugin 套件（auto-import、vue-components、vue-router）處理自動匯入與路由，後端需求（OAuth、WebSocket、資料 API）預計另外架設。既有的 setup-project-rules change 已完成 proposal、design、specs、tasks 等完整規劃。

本次 change 將技術架構從 Vue 3 + Vite SPA 轉換為 Nuxt full-stack 架構，保留所有業務功能需求不變，僅調整技術基礎設施。

## Goals / Non-Goals

**Goals:**
- 將專案基礎架構改為 Nuxt，利用其內建的 auto-imports、file-based routing、Nitro server engine
- 統一前後端於同一專案，OAuth callback 與 API routes 直接在 `server/` 目錄實作
- 採用 Hybrid Rendering，依路由特性選擇最佳渲染策略
- 保留 shadcn-vue + Tailwind CSS 4 的 UI 技術選型（透過 `shadcn-nuxt` 模組整合）
- 保留所有既有業務功能 capability 的需求規格

**Non-Goals:**
- 不重新設計業務功能的 specs（worship-ceremony、joss-paper-burning 等維持不變）
- 不改變 UI 設計風格（廟宇莊嚴深色主題維持不變）
- 不在本次 change 中實作完整後端邏輯，僅建立 Nitro server 骨架

## Decisions

### 1. 框架：Nuxt（最新穩定版）

**選擇**：使用 Nuxt 最新穩定版（4.x 或 3.15+），取代 Vue 3 + Vite 純前端架構

**理由**：
- Nuxt 底層仍使用 Vue 3 + Vite，所有 Vue 3 生態系套件（Pinia、VueUse、GSAP、shadcn-vue）完全相容
- 內建 file-based routing、auto-imports、`useFetch`/`useAsyncData`，無需 unplugin 系列套件
- Nitro server engine 提供 `server/api/` 與 `server/routes/`，OAuth callback、使用者 API 可統一在專案內實作
- 支援 70+ 部署平台（Vercel、Netlify、Cloudflare Workers、AWS Lambda 等）

**替代方案考量**：
- 維持 Vue 3 + Vite：需手動整合大量 plugin，後端需另外架設，長期維護成本較高
- Next.js (React)：生態系不同，無法沿用 Vue 生態系的 shadcn-vue、Pinia 等工具

### 2. 目錄結構：Nuxt 慣例

**選擇**：遵循 Nuxt 慣例目錄結構

```
app/
  ├── pages/               # 檔案式路由（自動產生）
  ├── components/           # 元件自動匯入
  │   └── ui/              # shadcn-vue 生成的元件
  ├── composables/          # composables 自動匯入
  ├── middleware/           # 路由守衛（auth 等）
  ├── layouts/             # 頁面 layout
  ├── plugins/             # Nuxt plugins（GSAP、motion 等）
  └── assets/              # 靜態資源、全域樣式
server/
  ├── api/                 # API routes（RESTful endpoints）
  ├── routes/              # Server routes（WebSocket 等）
  ├── middleware/          # Server middleware
  └── utils/               # Server utilities
stores/                    # Pinia stores
types/                     # TypeScript 型別定義
locales/                   # i18n 翻譯檔
data/                      # 靜態資料（神明、廟宇 JSON）
public/                    # 公開靜態檔案
```

**理由**：
- Nuxt 自動掃描 `app/components/`、`app/composables/`、`app/pages/` 提供 auto-import 與路由
- `server/` 目錄由 Nitro 處理，與前端完全隔離，可獨立測試
- 保留 feature-based 子目錄組織法：`app/components/worship/`、`app/components/auth/` 等

### 3. 渲染策略：Hybrid Rendering

**選擇**：透過 `routeRules` 按路由設定不同渲染模式

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },                    // 首頁 SSG
    '/about': { prerender: true },               // 關於頁 SSG
    '/worship/**': { ssr: false },               // 儀式互動頁 SPA
    '/temple/**': { ssr: false },                // 廟宇打卡 SPA
    '/group/**': { ssr: false },                 // 多人拜拜 SPA
    '/profile/**': { ssr: false },               // 個人頁 SPA
    '/api/**': { cors: true },                   // API routes
  }
})
```

**理由**：
- 首頁、關於頁等靜態內容使用 SSG 提供最佳載入速度與 SEO
- 儀式互動頁面使用 SPA mode 避免 SSR hydration 對動畫的干擾
- API routes 走 server，支援 CORS

### 4. UI 框架：shadcn-nuxt + Tailwind CSS 4

**選擇**：使用 `shadcn-nuxt` 模組整合 shadcn-vue，搭配 `@nuxtjs/tailwindcss` 模組

**理由**：
- `shadcn-nuxt` 是 shadcn-vue 的官方 Nuxt 模組，安裝元件的方式不變（`npx shadcn-vue@latest add`）
- 設計系統（絳紅、琉璃金、蒼綠配色）完全保留
- `@nuxtjs/tailwindcss` 提供零配置整合

**替代方案考量**：
- Nuxt UI v3：功能完整但設計風格預設偏向現代簡約，不符合廟宇莊嚴主題的高度客製需求

### 5. 狀態管理：Pinia（@pinia/nuxt）

**選擇**：使用 `@pinia/nuxt` 模組

**理由**：
- Nuxt 官方 Pinia 模組，自動註冊、SSR-safe
- stores 目錄下的 store 自動匯入
- 與既有 Pinia store 設計完全相容

### 6. i18n：@nuxtjs/i18n

**選擇**：使用 `@nuxtjs/i18n` 取代手動 vue-i18n 設定

**理由**：
- 提供 SEO 友善的 locale URL 策略（`/zh-TW/worship`、`/en/worship`）
- 內建瀏覽器語言自動偵測
- 支援 lazy loading 語言包
- 底層仍使用 vue-i18n，API 相容

**URL 策略**：使用 `prefix_except_default`，預設語言（zh-TW）不加前綴

### 7. PWA：@vite-pwa/nuxt

**選擇**：使用 `@vite-pwa/nuxt` 取代 `vite-plugin-pwa`

**理由**：
- 同一團隊開發，API 相同，專為 Nuxt 優化
- Service Worker、manifest、workbox 配置方式不變

### 8. 動畫引擎：維持 @vueuse/motion + GSAP

**選擇**：透過 Nuxt plugin 註冊 @vueuse/motion，GSAP 在 composables 中使用

**理由**：
- @vueuse/motion 提供 `nuxt-motion` 模組可直接使用（或透過 plugin 註冊）
- GSAP 為純 JS 庫，不受框架影響
- Canvas/WebGL 粒子動畫同樣不受影響

### 9. 後端 API 骨架（Nitro）

**選擇**：在 `server/api/` 建立 API route 骨架

**規劃**：
- `server/api/auth/google.get.ts`：Google OAuth callback
- `server/api/auth/line.get.ts`：LINE Login callback
- `server/api/auth/me.get.ts`：取得當前使用者資料
- `server/api/worship/[id].get.ts`：取得儀式紀錄
- `server/api/worship/index.post.ts`：儲存儀式紀錄
- `server/routes/_ws.ts`：WebSocket endpoint（多人拜拜）

**理由**：
- Nitro 的 file-based API routes 簡潔直覺
- 統一部署，不需額外的後端服務
- WebSocket 支援透過 Nitro 的 WebSocket adapter

## Risks / Trade-offs

### [Risk] Nuxt 學習曲線
團隊成員若不熟悉 Nuxt，需要額外學習 Nuxt 的慣例與生命週期（`useAsyncData`、`useFetch`、server middleware 等）。
→ **Mitigation**：Nuxt 底層仍是 Vue 3，大部分 Vue 知識直接適用。Nuxt 的慣例（file-based routing、auto-imports）反而減少需要學習的配置量。

### [Risk] SSR hydration 與動畫衝突
儀式互動頁面含大量 Canvas/GSAP 動畫，SSR hydration 可能導致閃爍或錯誤。
→ **Mitigation**：儀式互動頁面統一使用 `ssr: false`（SPA mode），完全避免 hydration 問題。僅靜態內容頁面使用 SSR/SSG。

### [Risk] Nitro server 增加部署複雜度
相比純靜態 SPA 部署，Nuxt 需要 server runtime。
→ **Mitigation**：Nitro 支援 serverless 部署（Vercel、Netlify Functions、Cloudflare Workers），實際上部署更簡單。純 SPA 頁面仍可 prerender 為靜態檔案。

### [Risk] 既有 specs 的技術參照需更新
部分 capability specs 中可能引用了 `src/` 路徑或 unplugin 相關的技術細節。
→ **Mitigation**：本次 change 僅更新 `project-setup` spec。其他 specs 以功能需求為主，技術實作細節在 tasks 階段處理。
