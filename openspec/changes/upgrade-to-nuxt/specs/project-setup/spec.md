## MODIFIED Requirements

### Requirement: 專案使用 Vue 3 + Vite 7 作為基礎框架
系統 SHALL 使用 Nuxt（最新穩定版）作為全端框架，底層基於 Vue 3 + Vite，採用 TypeScript 作為開發語言，使用 Composition API + `<script setup>` 語法。專案 SHALL 使用 `npx nuxi@latest init` 初始化。

#### Scenario: 專案初始化完成
- **WHEN** 開發者執行 `npx nuxi@latest init` 初始化專案
- **THEN** 系統產生基於 Nuxt 的 TypeScript 專案結構，包含 `nuxt.config.ts`、`app/` 目錄、`server/` 目錄

#### Scenario: 開發伺服器啟動
- **WHEN** 開發者執行 `pnpm run dev`
- **THEN** Nuxt 開發伺服器啟動並提供 HMR 熱更新功能，同時啟動 Nitro server

### Requirement: 整合 shadcn-vue + Tailwind CSS 4
系統 SHALL 使用 `shadcn-nuxt` 模組整合 shadcn-vue 元件庫，搭配 `@nuxtjs/tailwindcss` 模組整合 Tailwind CSS 4 作為 UI 框架。

#### Scenario: shadcn-vue 元件可用
- **WHEN** 開發者透過 `npx shadcn-vue@latest add <component>` 安裝元件
- **THEN** 元件原始碼被複製到 `app/components/ui/` 目錄下，可直接修改與客製化

#### Scenario: Tailwind CSS 4 樣式生效
- **WHEN** 開發者在元件中使用 Tailwind CSS 類別
- **THEN** 對應的 CSS 樣式正確套用於元件

### Requirement: 採用 Feature-based 目錄結構
系統 SHALL 遵循 Nuxt 慣例目錄結構，前端程式碼置於 `app/` 目錄，後端程式碼置於 `server/` 目錄，並在各目錄內以 feature-based 子目錄組織。

#### Scenario: Nuxt 慣例目錄完整
- **WHEN** 開發者查看專案根目錄
- **THEN** 包含 `app/`（pages、components、composables、middleware、layouts、plugins）與 `server/`（api、routes、middleware、utils）目錄結構

#### Scenario: 功能模組目錄完整
- **WHEN** 開發者查看 `app/components/` 目錄
- **THEN** 各 capability 擁有獨立的子資料夾（auth、worship、joss-paper、offering、divination、incense、paper-craft、eco-tracker、temple-checkin、group-worship）

#### Scenario: 共用元件獨立存放
- **WHEN** 開發者查看 `app/components/ui/` 目錄
- **THEN** shadcn-vue 生成的共用 UI 元件存放於此

### Requirement: 配置為 PWA 應用
系統 SHALL 使用 `@vite-pwa/nuxt` 模組將專案配置為 Progressive Web App。

#### Scenario: PWA 可安裝至手機桌面
- **WHEN** 使用者在行動裝置瀏覽器中開啟應用
- **THEN** 瀏覽器提示「新增至主畫面」的安裝提示

#### Scenario: Service Worker 註冊成功
- **WHEN** 應用首次載入完成
- **THEN** Service Worker 成功註冊，支援離線快取與背景任務

### Requirement: 整合 Pinia 狀態管理
系統 SHALL 使用 `@pinia/nuxt` 模組整合 Pinia 作為全域狀態管理方案，stores 自動匯入。

#### Scenario: 全域狀態可存取
- **WHEN** 任何功能模組需要存取全域狀態
- **THEN** 透過 Pinia store 取得與更新狀態，無需手動 import store 檔案

### Requirement: 整合動畫引擎（@vueuse/motion + GSAP）
系統 SHALL 透過 Nuxt plugin 註冊 @vueuse/motion 處理元件級 UI 動畫，使用 GSAP 處理複雜儀式動畫。

#### Scenario: 頁面過渡動畫
- **WHEN** 使用者在不同頁面之間切換
- **THEN** 頁面以平滑的過渡動畫呈現切換效果

### Requirement: 整合 unplugin-vue-router（檔案式路由）
系統 SHALL 使用 Nuxt 內建的檔案式路由，根據 `app/pages/` 目錄結構自動產生型別安全的路由設定，不需要額外安裝 unplugin-vue-router。

#### Scenario: 路由切換
- **WHEN** 使用者點擊導航項目或儀式流程推進
- **THEN** 頁面以 SPA 方式切換，不重新載入整個頁面

#### Scenario: 新增頁面自動產生路由
- **WHEN** 開發者在 `app/pages/` 目錄下新增 `.vue` 檔案
- **THEN** 路由自動產生，無需手動維護路由設定檔

### Requirement: 整合 unplugin-auto-import
系統 SHALL 使用 Nuxt 內建的 auto-import 機制自動匯入 Vue、Vue Router、Pinia、VueUse 等常用 API，以及專案 `app/composables/` 目錄下的自定義 composables，不需要額外安裝 unplugin-auto-import。

#### Scenario: Vue API 自動匯入
- **WHEN** 開發者在 `<script setup>` 中使用 `ref`、`computed`、`watch` 等 Vue API
- **THEN** 無需手動撰寫 `import { ref } from 'vue'`，API 自動可用

### Requirement: 整合 unplugin-vue-components
系統 SHALL 使用 Nuxt 內建的元件自動匯入機制，自動匯入 `app/components/` 目錄下的元件（含 shadcn-vue 元件），不需要額外安裝 unplugin-vue-components。

#### Scenario: 元件自動匯入
- **WHEN** 開發者在 template 中使用 `<Button>` 等元件
- **THEN** 無需手動撰寫 import 語句，元件自動註冊可用

## ADDED Requirements

### Requirement: 採用 Hybrid Rendering 渲染策略
系統 SHALL 透過 `routeRules` 為不同路由設定最佳渲染策略：靜態內容頁面使用 prerender（SSG），儀式互動頁面使用 SPA mode（`ssr: false`），API routes 走 server。

#### Scenario: 首頁使用 SSG 預渲染
- **WHEN** 使用者載入首頁
- **THEN** 頁面由預渲染的靜態 HTML 提供，載入速度最快

#### Scenario: 儀式互動頁面使用 SPA mode
- **WHEN** 使用者進入儀式互動頁面（`/worship/**`）
- **THEN** 頁面以純客戶端 SPA 模式運行，不經過 SSR hydration，避免動畫衝突

#### Scenario: API routes 可用
- **WHEN** 前端發送請求至 `/api/**` 路徑
- **THEN** 請求由 Nitro server 處理並回傳 JSON 回應

### Requirement: 建立 Nitro Server API 骨架
系統 SHALL 在 `server/api/` 目錄下建立後端 API route 骨架，包含 OAuth callback、使用者資料、儀式紀錄等 endpoint。

#### Scenario: OAuth callback endpoint 存在
- **WHEN** 開發者查看 `server/api/auth/` 目錄
- **THEN** 包含 Google OAuth 與 LINE Login 的 callback handler 骨架

#### Scenario: API route 可回應請求
- **WHEN** 前端呼叫 `useFetch('/api/auth/me')`
- **THEN** server 回傳使用者資料或未登入狀態

### Requirement: 整合 @nuxtjs/i18n 多語系模組
系統 SHALL 使用 `@nuxtjs/i18n` 模組提供多語系支援，支援 SEO 友善的 locale URL、瀏覽器語言自動偵測、lazy loading 語言包。URL 策略 SHALL 使用 `prefix_except_default`，預設語言（zh-TW）不加前綴。

#### Scenario: 預設語言為繁體中文
- **WHEN** 使用者首次造訪應用且瀏覽器語言為 zh-TW 或未偵測到支援語言
- **THEN** 應用以繁體中文顯示，URL 不帶語言前綴

#### Scenario: 切換語言後 URL 更新
- **WHEN** 使用者將語言切換為英文
- **THEN** URL 自動加上 `/en` 前綴（如 `/en/worship`），介面即時更新為英文

#### Scenario: 語言包 lazy loading
- **WHEN** 使用者切換到非預設語言
- **THEN** 對應語言包動態載入，不影響初始載入大小
