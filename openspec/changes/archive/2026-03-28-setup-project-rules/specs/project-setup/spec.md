## ADDED Requirements

### Requirement: 專案使用 Nuxt 4 作為基礎框架
系統 SHALL 使用 Nuxt 4 建立全端專案，採用 TypeScript 作為開發語言，使用 Vue 3 Composition API + `<script setup>` 語法。Nuxt 4 內建 file-based routing、auto-import、auto component registration，不需額外安裝 unplugin 系列插件。

#### Scenario: 專案初始化完成
- **WHEN** 開發者執行專案初始化命令
- **THEN** 系統產生基於 Nuxt 4 的 TypeScript 專案結構，包含 `app/` 目錄

#### Scenario: 開發伺服器啟動
- **WHEN** 開發者執行 `pnpm run dev`
- **THEN** Nuxt 開發伺服器啟動並提供 HMR 熱更新功能

### Requirement: 整合 shadcn-nuxt + Tailwind CSS 4
系統 SHALL 整合 shadcn-nuxt 元件庫與 Tailwind CSS 4 作為 UI 框架。

#### Scenario: shadcn-nuxt 元件可用
- **WHEN** 開發者透過 `npx shadcn-vue@latest add <component>` 安裝元件
- **THEN** 元件原始碼被複製到 `app/components/ui/` 目錄下，可直接修改與客製化，並由 Nuxt 自動註冊

#### Scenario: Tailwind CSS 4 樣式生效
- **WHEN** 開發者在元件中使用 Tailwind CSS 類別
- **THEN** 對應的 CSS 樣式正確套用於元件

### Requirement: 配置 Vitest 測試框架
系統 SHALL 使用 @nuxt/test-utils 搭配 Vitest 作為測試框架。

#### Scenario: 執行測試
- **WHEN** 開發者執行 `pnpm run test`
- **THEN** Vitest 執行所有測試檔案並輸出測試結果

#### Scenario: 測試涵蓋 Nuxt 頁面與元件
- **WHEN** 開發者撰寫 Nuxt 頁面或元件的測試
- **THEN** 測試可使用 @nuxt/test-utils 進行元件渲染與互動測試

### Requirement: 採用 Nuxt 4 目錄結構
系統 SHALL 依照 Nuxt 4 慣例組織專案目錄，使用 `app/` 目錄作為主要應用程式碼位置。

#### Scenario: Nuxt 4 目錄結構完整
- **WHEN** 開發者查看專案目錄
- **THEN** 包含 `app/`（pages、components、composables、layouts、plugins、assets）、`stores/`、`types/`、`data/`、`locales/`、`server/` 等目錄

#### Scenario: 共用元件獨立存放
- **WHEN** 開發者查看 `app/components/` 目錄
- **THEN** 共用 UI 元件與 shadcn-nuxt 生成的元件存放於此，由 Nuxt 自動註冊

### Requirement: 配置為 PWA 應用
系統 SHALL 使用 `@vite-pwa/nuxt` 將專案配置為 Progressive Web App。

#### Scenario: PWA 可安裝至手機桌面
- **WHEN** 使用者在行動裝置瀏覽器中開啟應用
- **THEN** 瀏覽器提示「新增至主畫面」的安裝提示

#### Scenario: Service Worker 註冊成功
- **WHEN** 應用首次載入完成
- **THEN** Service Worker 成功註冊，支援離線快取與背景任務

### Requirement: 採用 Mobile-First 響應式設計
系統 SHALL 以手機螢幕為優先設計目標，所有 UI/UX 以觸控操作為優先考量。

#### Scenario: 手機螢幕下的版面配置
- **WHEN** 使用者以手機螢幕（寬度 < 768px）瀏覽應用
- **THEN** 所有頁面以垂直單欄排版呈現，觸控目標尺寸 SHALL 至少 44x44px

#### Scenario: 桌面螢幕的響應式延伸
- **WHEN** 使用者以桌面螢幕（寬度 >= 1024px）瀏覽應用
- **THEN** 版面自動調整為適合桌面的寬版配置，不影響功能完整性

### Requirement: 整合 @pinia/nuxt 狀態管理
系統 SHALL 使用 @pinia/nuxt 作為全域狀態管理方案，自動註冊 Pinia 並掃描 `stores/` 目錄。

#### Scenario: 全域狀態可存取
- **WHEN** 任何功能模組需要存取全域狀態
- **THEN** 透過 Pinia store 取得與更新狀態

### Requirement: 整合動畫引擎（@vueuse/motion/nuxt + GSAP）
系統 SHALL 使用 @vueuse/motion/nuxt 處理元件級 UI 動畫（進出場、hover 等），使用 GSAP（透過 Nuxt plugin）處理複雜儀式動畫（焚燒、擲筊、煙霧等）。

#### Scenario: 頁面過渡動畫
- **WHEN** 使用者在不同頁面之間切換
- **THEN** 頁面以平滑的過渡動畫呈現切換效果

### Requirement: 配置 routeRules 每頁渲染策略
系統 SHALL 在 `nuxt.config.ts` 中配置 `routeRules`，針對不同路由設定適合的渲染模式（prerender、SSR、CSR）。

#### Scenario: 首頁預渲染
- **WHEN** 使用者訪問 `/`
- **THEN** 頁面由預渲染的靜態 HTML 提供，載入速度快且 SEO 友善

#### Scenario: 儀式頁面 CSR
- **WHEN** 使用者訪問 `/worship/**` 等互動頁面
- **THEN** 頁面以 CSR 模式渲染（`ssr: false`），避免 SSR 帶來的不必要開銷

### Requirement: Nuxt 內建的自動匯入功能
系統 SHALL 利用 Nuxt 4 內建的 auto-import 功能：自動匯入 Vue、Vue Router、Pinia 等 API，自動匯入 `app/composables/` 目錄下的 composables，自動註冊 `app/components/` 目錄下的元件。不需額外安裝 unplugin 系列插件。

#### Scenario: Vue API 自動匯入
- **WHEN** 開發者在 `<script setup>` 中使用 `ref`、`computed`、`watch` 等 Vue API
- **THEN** 無需手動撰寫 `import { ref } from 'vue'`，API 自動可用

#### Scenario: 元件自動註冊
- **WHEN** 開發者在 template 中使用 `<Button>` 等元件
- **THEN** 無需手動 import，Nuxt 自動從 `app/components/` 註冊元件

### Requirement: 建立靜態資料結構骨架
系統 SHALL 在 `data/` 建立廟宇、神明、供品等 JSON 資料的 TypeScript 型別定義與極少量範例資料。廟宇名稱 MUST 為自訂虛構名稱。

#### Scenario: 型別定義可用
- **WHEN** 開發者需要使用廟宇或神明資料
- **THEN** 可匯入對應的 TypeScript 型別介面（Temple、Deity、Offering 等）

#### Scenario: 範例資料可存取
- **WHEN** 開發者匯入靜態 JSON 資料
- **THEN** 取得至少 1 間虛構廟宇的範例資料

### Requirement: 定義所有功能頁面的路由骨架
系統 SHALL 在 `app/pages/` 建立所有功能頁面的空白佔位元件，由 Nuxt 自動產生路由。每個佔位頁面 SHALL 包含統一的基本佈局（使用 Nuxt layout）、頁面標題、「功能開發中」提示、對應的 capability 標識，並套用廟宇莊嚴風格主題配色。

#### Scenario: 通用頁面路由可存取
- **WHEN** 使用者導航至 `/`、`/login`、`/settings`、`/eco-impact`
- **THEN** 每個路由皆顯示對應的佔位頁面

#### Scenario: 拜拜儀式流程路由可存取
- **WHEN** 使用者導航至 `/worship`、`/worship/deity-select`、`/worship/ancestor-setup`、`/worship/offering`、`/worship/incense`、`/worship/prayer`、`/worship/divination`、`/worship/joss-paper`、`/worship/paper-craft`、`/worship/summary`
- **THEN** 每個路由皆顯示對應的佔位頁面

#### Scenario: 廟宇打卡路由可存取
- **WHEN** 使用者導航至 `/temple/scan`、`/temple/search`、`/temple/route-guide`、`/temple/footprint`
- **THEN** 每個路由皆顯示對應的佔位頁面

#### Scenario: 多人拜拜路由可存取
- **WHEN** 使用者導航至 `/group/create`、`/group/join`
- **THEN** 每個路由皆顯示對應的佔位頁面

#### Scenario: 路由間可正常導航
- **WHEN** 使用者在任意兩個已定義路由之間切換
- **THEN** 頁面正常切換，無 console 錯誤
