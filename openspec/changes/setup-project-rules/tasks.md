# 實作任務清單

> 專案基礎建設與路由骨架定義（Nuxt 4 架構）。各功能實作將在各自獨立的變更中進行。

---

## 1. 專案初始化

- [ ] 1.1 使用 `npx nuxi@latest init` 建立 Nuxt 4 專案，確認 `app/` 目錄結構、`nuxt.config.ts`、TypeScript 設定正確
- [ ] 1.2 安裝並設定 Tailwind CSS 4，在 `app/assets/css/main.css` 配置 `@import "tailwindcss"`，確認 Tailwind 類別可正常套用
- [ ] 1.3 初始化 shadcn-nuxt，設定廟宇莊嚴風格主題配色（絳紅、琉璃金、蒼綠、玄黑、香灰白），安裝基礎元件（Button、Card）

## 2. Nuxt 模組整合

- [ ] 2.1 安裝 `@pinia/nuxt` + `pinia-plugin-persistedstate`，在 `nuxt.config.ts` 註冊模組，確認 persist 功能正常
- [ ] 2.2 安裝 `@vueuse/motion/nuxt`，在 `nuxt.config.ts` 註冊模組；安裝 `gsap`，建立 Nuxt plugin 註冊 GSAP
- [ ] 2.3 安裝 `@vite-pwa/nuxt`，在 `nuxt.config.ts` 配置 PWA manifest 與 Service Worker 基本策略
- [ ] 2.4 安裝 `@nuxt/test-utils` + `vitest`，設定測試環境，撰寫一個範例測試確認環境正確

## 3. routeRules 與 Layout

- [ ] 3.1 在 `nuxt.config.ts` 配置 `routeRules`：`/` prerender、`/login` `/settings` `/worship/**` `/temple/**` `/group/**` 為 CSR（`ssr: false`）、`/eco-impact` 為 SSR
- [ ] 3.2 建立 `app/layouts/default.vue` 預設佈局（深色主題背景、header + main 區域、Mobile-First 響應式）

## 4. 目錄結構與靜態資料

- [ ] 4.1 建立 Nuxt 4 目錄結構：`app/` 下建立 components/ui、composables、layouts、plugins、assets/css 目錄，根目錄建立 stores、types、data、locales（zh-TW、en、ja、ko）、server 目錄，各目錄放置基本骨架檔案
- [ ] 4.2 在 `data/` 建立靜態資料 TypeScript 型別定義（Temple、Deity、Offering、WorshipRoute），建立 `temples.json`、`deities.json` 並填入至少 1 間虛構廟宇的範例資料

## 5. 路由骨架定義

- [ ] 5.1 建立通用頁面佔位元件：`app/pages/index.vue`（首頁）、`login.vue`（登入）、`settings.vue`（設定）、`eco-impact.vue`（環保成效）
- [ ] 5.2 建立拜拜儀式路由群佔位元件：`app/pages/worship/` 下建立 index、deity-select、ancestor-setup、offering、incense、prayer、divination、joss-paper、paper-craft、summary 共 10 個 `.vue` 檔案
- [ ] 5.3 建立廟宇打卡路由群佔位元件：`app/pages/temple/` 下建立 scan、search、route-guide、footprint 共 4 個 `.vue` 檔案
- [ ] 5.4 建立多人拜拜路由群佔位元件：`app/pages/group/` 下建立 create、join 共 2 個 `.vue` 檔案
- [ ] 5.5 每個佔位頁面使用 default layout，包含頁面標題、「功能開發中」提示、對應 capability 標識

## 6. 驗證

- [ ] 6.1 確認 `pnpm run dev` 可啟動，所有路由可正常導航，無 console 錯誤
- [ ] 6.2 確認 `pnpm run test` 可執行範例測試並通過
- [ ] 6.3 確認 TypeScript 編譯無錯誤（`pnpm run build` 或 `npx nuxi typecheck`）
