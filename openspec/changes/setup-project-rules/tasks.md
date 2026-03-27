# 實作任務清單

> 專案基礎建設與路由骨架定義。各功能實作將在各自獨立的變更中進行。

---

## 1. 專案初始化

- [ ] 1.1 使用 `pnpm create vite` 建立 Vue 3 + TypeScript 專案，設定 `tsconfig.json`、`vite.config.ts`、路徑別名 `@/`
- [ ] 1.2 安裝並設定 Tailwind CSS 4（Oxide 引擎），確認 Tailwind 類別可正常套用
- [ ] 1.3 初始化 shadcn-vue，設定廟宇莊嚴風格主題配色（絳紅、琉璃金、蒼綠、玄黑、香灰白），安裝基礎元件（Button、Card）

## 2. 基礎套件整合

- [ ] 2.1 安裝 Pinia 並註冊為 Vue plugin，安裝 `pinia-plugin-persistedstate`，確認 persist 功能正常
- [ ] 2.2 安裝並設定 `unplugin-vue-router`（`src/pages/` 檔案式路由），產生 `typed-router.d.ts`
- [ ] 2.3 安裝並設定 `unplugin-auto-import`（Vue、Vue Router、Pinia、VueUse API + `src/composables/`），產生 `auto-imports.d.ts`
- [ ] 2.4 安裝並設定 `unplugin-vue-components`（`src/components/` 自動匯入），產生 `components.d.ts`
- [ ] 2.5 安裝 `@vueuse/motion` 並註冊為 Vue plugin，安裝 `gsap`，確認兩者可正常運作
- [ ] 2.6 安裝並設定 `vite-plugin-pwa`，配置 manifest.json 與 Service Worker 基本策略
- [ ] 2.7 安裝 Vitest 4.x + `@testing-library/vue` + `@vue/test-utils`，設定 `vitest.config.ts`，撰寫一個範例測試確認環境正確

## 3. 目錄結構與靜態資料

- [ ] 3.1 建立 Feature-based 目錄結構：`src/` 下建立 app、components/ui、pages、composables、stores、types、locales（zh-TW、en、ja、ko）、data、lib、styles 目錄，各目錄放置基本骨架檔案
- [ ] 3.2 在 `src/data/` 建立靜態資料 TypeScript 型別定義（Temple、Deity、Offering、WorshipRoute），建立 `temples.json`、`deities.json` 並填入至少 1 間虛構廟宇的範例資料

## 4. 路由骨架定義

- [ ] 4.1 建立通用頁面佔位元件：`src/pages/index.vue`（首頁）、`login.vue`（登入）、`settings.vue`（設定）、`eco-impact.vue`（環保成效）
- [ ] 4.2 建立拜拜儀式路由群佔位元件：`src/pages/worship/` 下建立 index、deity-select、ancestor-setup、offering、incense、prayer、divination、joss-paper、paper-craft、summary 共 10 個 `.vue` 檔案
- [ ] 4.3 建立廟宇打卡路由群佔位元件：`src/pages/temple/` 下建立 scan、search、route-guide、footprint 共 4 個 `.vue` 檔案
- [ ] 4.4 建立多人拜拜路由群佔位元件：`src/pages/group/` 下建立 create、join 共 2 個 `.vue` 檔案
- [ ] 4.5 每個佔位頁面套用統一佈局（深色主題背景、header + main 區域、頁面標題、「功能開發中」提示、對應 capability 標識）

## 5. 驗證

- [ ] 5.1 確認 `pnpm run dev` 可啟動，所有路由可正常導航，無 console 錯誤
- [ ] 5.2 確認 `pnpm run test` 可執行範例測試並通過
- [ ] 5.3 確認 TypeScript 編譯無錯誤，所有自動產生的型別宣告檔正常運作
