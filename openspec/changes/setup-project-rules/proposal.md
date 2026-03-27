## Why

華人傳統的燒金紙、拜拜等文化習俗每年產生大量碳排放與空氣污染，不僅影響環境品質，也與現代永續發展的價值觀產生衝突。許多人想維持傳統信仰但又對環保有所顧慮。透過將這些儀式數位化搬上網路，讓使用者能在線上完成焚香、燒金紙、祭拜等儀式，既保留文化傳承又達到環保目標。

本變更專注於建立專案基礎架構——開發環境、基礎套件整合、目錄結構、設計系統，以及所有功能頁面的路由骨架定義。各功能的實際實作將在各自獨立的變更中進行。

## What Changes

- **建立全新的 Web 應用程式專案**：以 Vue 3 + Vite 7 為基礎，搭配 shadcn-vue + Tailwind CSS 4 作為 UI 框架，Vitest 作為測試工具。採用 **Mobile-First** 設計策略，所有 UI/UX 以行動裝置為優先考量
- **整合基礎套件**：Pinia 狀態管理、unplugin 系列（vue-router、auto-import、vue-components）、@vueuse/motion + GSAP 動畫引擎、vite-plugin-pwa
- **建立 Feature-based 目錄結構**：包含 app、components/ui、pages、composables、stores、types、locales、data、lib、styles 等目錄
- **建立廟宇莊嚴風格設計系統**：深色主題配色（絳紅、琉璃金、蒼綠、玄黑、香灰白）
- **建立靜態資料結構骨架**：廟宇、神明、供品等 JSON schema 與少量範例資料
- **定義所有功能頁面的路由骨架**：使用 unplugin-vue-router 檔案式路由，為所有功能頁面建立空白佔位元件（首頁、登入、設定、拜拜儀式流程、廟宇打卡、多人拜拜、環保成效），僅包含基本佈局，不含功能實作

## Capabilities

### New Capabilities
- `project-setup`: 專案基礎架構建立——Vue 3 + Vite 7 環境設定、shadcn-vue + Tailwind CSS 4 整合、Pinia 狀態管理、unplugin 系列自動匯入、動畫引擎（@vueuse/motion + GSAP）、PWA 配置、Vitest 測試框架、Feature-based 目錄結構、靜態資料結構骨架、廟宇莊嚴風格設計系統、Mobile-First 響應式設計、以及所有功能頁面的路由骨架定義（空白佔位元件）

### Modified Capabilities
_無既有功能需要修改（全新專案）_

## Impact

- **技術架構**：建立全新的前端專案，需設定完整的開發環境
- **相依套件**：Vue 3.5+、Vite 7.x、Tailwind CSS 4.x、shadcn-vue、Vitest 4.x、Pinia、Vue Router 4、unplugin-vue-router、unplugin-auto-import、unplugin-vue-components、@vueuse/motion、GSAP、VueUse、vite-plugin-pwa
- **行動優先**：所有 UI/UX 以手機螢幕為主要設計目標，觸控手勢操作優先，桌面版為響應式延伸
- **後續變更**：各功能（user-auth、worship-ceremony、joss-paper-burning、offering-arrangement、divination-blocks、incense-simulation、paper-craft-burning、eco-impact-tracker、temple-checkin、group-worship、i18n）將各自作為獨立變更實作，基於本變更建立的路由骨架與基礎設施
