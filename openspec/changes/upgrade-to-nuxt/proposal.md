## Why

目前專案規劃使用 Vue 3 + Vite 作為純 SPA 架構，需手動整合大量 plugin（unplugin-auto-import、unplugin-vue-components、unplugin-vue-router、vite-plugin-pwa 等）。Nuxt 將這些功能全部內建（file-based routing、auto-imports、SSR/SSG/SPA 混合渲染、Nitro server engine），可大幅減少基礎設施配置工作，讓開發精力集中在業務功能上。此外，Nuxt 的 `server/` 目錄可直接建立 API routes，為未來的 OAuth callback、WebSocket server、資料同步等後端需求提供統一的全端解決方案，無需另外架設後端服務。

## What Changes

- **將前端框架從 Vue 3 + Vite SPA 改為 Nuxt**：採用最新穩定版 Nuxt（4.x 或 3.15+），使用 Nuxt 內建的 file-based routing、auto-imports、`useFetch`/`useAsyncData` 等功能，移除 `unplugin-auto-import`、`unplugin-vue-components`、`unplugin-vue-router` 等手動整合
- **調整目錄結構為 Nuxt 慣例**：採用 `app/`（前端）+ `server/`（後端 API）結構，`pages/` 提供自動路由、`components/` 自動匯入、`composables/` 自動匯入、`middleware/` 路由守衛
- **引入 Nitro server engine**：OAuth callback（Google、LINE）、使用者資料 API、多人拜拜 WebSocket server 等後端邏輯可直接放在 `server/` 目錄，統一部署
- **調整渲染策略為 Hybrid Rendering**：透過 `routeRules` 按路由設定渲染模式——首頁/關於頁 prerender（SSG）、儀式互動頁 SPA mode（`ssr: false`）、API routes 走 server
- **將 PWA 模組改為 `@vite-pwa/nuxt`**：Nuxt 專用 PWA 模組，功能與 `vite-plugin-pwa` 相同但整合度更佳
- **將 i18n 改為 `@nuxtjs/i18n`**：提供 SEO 友善的 locale URLs、自動語言偵測、lazy loading 語言包，取代手動 vue-i18n 設定
- **評估 Nuxt UI 或保留 shadcn-vue**：可使用 `shadcn-nuxt` 模組無縫整合 shadcn-vue，或考慮改用 Nuxt 官方的 Nuxt UI v3（基於 Reka UI，內建深色模式與鍵盤快捷鍵）

## Capabilities

### New Capabilities
_無新增功能 capability——本次變更聚焦於技術架構調整，所有業務功能 capability 維持不變_

### Modified Capabilities
- `project-setup`: 整個專案基礎架構從 Vue 3 + Vite SPA 改為 Nuxt full-stack 架構，包含目錄結構、plugin 整合方式、渲染策略、開發工具鏈全面調整

## Impact

- **專案初始化方式**：從 `pnpm create vite` 改為 `npx nuxi@latest init`
- **目錄結構**：遵循 Nuxt 慣例（`app/pages/`、`app/components/`、`app/composables/`、`server/api/`、`server/routes/`）
- **移除的相依套件**：`unplugin-auto-import`、`unplugin-vue-components`、`unplugin-vue-router`、`vite-plugin-pwa`、`vite-plugin-vue-devtools`（Nuxt 全部內建）
- **新增的相依套件**：`nuxt`、`@vite-pwa/nuxt`、`@nuxtjs/i18n`、`@nuxtjs/tailwindcss`、`shadcn-nuxt`（或 `@nuxt/ui`）
- **後端架構**：新增 Nitro server layer，OAuth flow、API endpoints 可直接在專案內實作
- **部署方式**：Nitro 支援 70+ hosting presets（Vercel、Netlify、Cloudflare Workers、AWS Lambda 等），部署更靈活
- **既有 capability specs**：所有業務功能 spec（worship-ceremony、joss-paper-burning 等）的需求不變，僅 `project-setup` spec 需要更新技術選型
