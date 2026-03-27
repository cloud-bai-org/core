## Context

這是一個全新專案，目標是將華人傳統拜拜習俗（燒金紙、焚香、擲筊、供品擺設等）數位化，透過網頁應用讓使用者能在線上或實體廟宇中以環保方式完成儀式。

本變更僅聚焦於專案基礎建設：初始化開發環境、整合基礎套件、建立目錄結構、設計系統，並為所有功能頁面定義路由骨架。各功能的實作將在各自獨立的變更中進行。

**目標使用者**：台灣地區的一般民眾，以手機使用為主。

**技術限制**：
- 前端為主的 PWA 架構，後端用於驗證與資料同步
- 需支援行動裝置相機（QR Code 掃描、供品拍照）
- 背景計時需在頁面離開後持續運作

## Goals / Non-Goals

**Goals:**
- 建立完整的前端開發環境（Vue 3 + Vite 7 + shadcn-vue + Tailwind CSS 4 + Vitest 4）
- 以 Mobile-First PWA 架構為核心，支援安裝至手機桌面與背景推播通知
- 整合 Pinia、unplugin 系列、動畫引擎等基礎套件
- 建立 Feature-based 目錄結構與靜態資料骨架
- 建立廟宇莊嚴風格設計系統
- 定義所有功能頁面的路由骨架（空白佔位元件）

**Non-Goals（各自獨立變更實作）:**
- 不實作使用者驗證系統（user-auth）
- 不實作拜拜儀式流程（worship-ceremony）
- 不實作金紙焚燒動畫（joss-paper-burning）
- 不實作供品擺設系統（offering-arrangement）
- 不實作擲筊功能（divination-blocks）
- 不實作焚香模擬系統（incense-simulation）
- 不實作紙紮物品焚燒（paper-craft-burning）
- 不實作環保成效追蹤（eco-impact-tracker）
- 不實作廟宇打卡系統（temple-checkin）
- 不實作多人拜拜系統（group-worship）
- 不實作多語系支援（i18n）
- 不做金流串接
- 不做廟宇管理後台

## Decisions

### 1. 前端框架：Vue 3 + Vite 7

**選擇**：Vue 3.5+ 搭配 Vite 7 作為開發與建置工具

**理由**：
- Vue 3 的 Composition API + `<script setup>` 提供簡潔的開發體驗
- Vite 本身就是 Vue 作者開發的，Vue 整合度最佳
- 生態系成熟，shadcn-vue、Pinia、Vue Router、VueUse 等工具齊全

**替代方案考量**：
- Nuxt 4：SSR/SSG 能力強，但本專案以純前端 PWA 為主，不需要伺服器端渲染
- React：生態系成熟但 Vue 在原型開發與中小型專案更高效

### 2. UI 框架：shadcn-vue + Tailwind CSS 4

**選擇**：shadcn-vue 元件庫搭配 Tailwind CSS 4

**理由**：
- shadcn-vue 將元件原始碼複製到專案中，可完全客製化，適合需要高度設計客製的宗教文化主題
- 底層基於 Radix Vue，提供完整的無障礙支援
- Tailwind CSS 4 的 Oxide 引擎提供更快的建置速度

**設計系統**：採用「台灣廟宇莊嚴風格」深色主題，詳見 [design-guidelines.md](./specs/project-setup/design-guidelines.md)
- 主色 **絳紅** (#9E2A2B)、**琉璃金** (#D4AF37)、**蒼綠** (#2D6A59)
- 背景 **玄黑** (#1C1919)，文字 **香灰白** (#F0EBE1)
- 字體 Noto Sans TC，圓角 0.35rem 維持莊重感

### 3. 應用架構：SPA + PWA

**選擇**：單頁應用程式（SPA）搭配 Progressive Web App 配置

**理由**：
- SPA 適合儀式流程的連續體驗，頁面切換流暢
- PWA 提供 Service Worker 支援背景計時與推播通知
- 可安裝至手機桌面，接近原生 App 體驗
- 使用 `vite-plugin-pwa` 簡化 PWA 配置

### 4. 狀態管理：Pinia

**選擇**：Pinia 作為全域狀態管理方案

**理由**：
- Vue 官方推薦的狀態管理庫，與 Vue 3 深度整合
- API 簡潔，支援 TypeScript 類型推導
- 內建 persist plugin，可搭配 localStorage 實現訪客模式的本機暫存
- 支援 Vue DevTools，開發除錯方便

### 5. 動畫引擎：@vueuse/motion + GSAP

**選擇**：雙引擎分層策略——@vueuse/motion 處理元件級動畫，GSAP 處理複雜儀式動畫

**理由**：
- **@vueuse/motion**：提供 `v-motion` 指令，適合元件進出場、hover 效果等日常 UI 動畫
- **GSAP**：處理複雜的儀式動畫場景，支援時間軸序列（timeline）、精確控制進度與物理緩動
- 分層明確：元件動畫用 motion、儀式動畫用 GSAP，各司其職

### 6. 路由骨架：unplugin-vue-router 檔案式路由

**選擇**：在 `src/pages/` 建立對應的 `.vue` 檔案，由 unplugin-vue-router 自動產生路由設定。

**路由結構規劃**：
```
src/pages/
  ├── index.vue                    # 首頁
  ├── login.vue                    # 登入頁
  ├── settings.vue                 # 設定頁（含語言切換）
  ├── eco-impact.vue               # 環保成效頁
  ├── worship/
  │   ├── index.vue                # 拜拜模式選擇（拜神明/祭祖）
  │   ├── deity-select.vue         # 選擇神明
  │   ├── ancestor-setup.vue       # 祭祖設定（稱謂+地點）
  │   ├── offering.vue             # 供品擺設
  │   ├── incense.vue              # 焚香
  │   ├── prayer.vue               # 祈禱
  │   ├── divination.vue           # 擲筊
  │   ├── joss-paper.vue           # 金紙焚燒
  │   ├── paper-craft.vue          # 紙紮焚燒
  │   └── summary.vue              # 儀式摘要
  ├── temple/
  │   ├── scan.vue                 # QR Code 掃描打卡
  │   ├── search.vue               # 手動搜尋廟宇
  │   ├── route-guide.vue          # 參拜路線導覽
  │   └── footprint.vue            # 拜拜足跡地圖
  └── group/
      ├── create.vue               # 建立多人拜拜房間
      └── join.vue                 # 加入房間（輸入 PIN 碼）
```

每個佔位頁面包含統一的基本佈局（header + main）、頁面標題、「功能開發中」提示、對應的 capability 標識。

### 7. 專案目錄結構

**選擇**：扁平化目錄結構，依職責分類並以功能分子目錄

```
src/
  ├── app/                    # App 進入點、全域 plugin 註冊
  ├── components/             # 所有元件，依功能分子目錄
  │   └── ui/                 # shadcn-vue 生成的元件
  ├── pages/                  # 檔案式路由頁面
  ├── composables/            # 所有 composables
  ├── stores/                 # Pinia stores
  ├── types/                  # TypeScript 型別定義
  ├── locales/                # i18n 翻譯檔（預留目錄）
  ├── data/                   # 靜態資料（神明、廟宇、供品 JSON）
  ├── lib/                    # 工具函式、API client
  └── styles/                 # 全域樣式、Tailwind 設定
```

### 8. 廟宇與神明資料：靜態 JSON

**選擇**：第一版使用靜態 JSON 檔案儲存廟宇、神明、參拜路線資料

**理由**：
- 初始版本資料量有限，不需要完整的 CMS
- JSON 可版控，修改透明
- 預留資料結構設計，未來可無縫遷移至 API

**重要**：廟宇名稱一律使用自訂虛構名稱，不使用現實中既有的廟宇名稱。

## Risks / Trade-offs

### [Risk] 路由結構可能在功能開發時需要調整
功能開發過程中可能發現需要新增、移除或重組路由。
→ **Mitigation**：檔案式路由本身就容易調整（新增/移動/刪除 .vue 檔案即可），此風險影響極低。

### [Risk] 佔位元件可能被遺留未實作
空白佔位頁面如果沒有對應的功能變更來覆蓋，可能被遺留。
→ **Mitigation**：每個佔位頁面清楚標示對應的 capability 名稱，方便追蹤。

### [Risk] 文化敏感度
涉及宗教信仰內容，UI/UX 設計需莊重得體，避免戲謔或冒犯。
→ **Mitigation**：UI/UX 設計以莊嚴、典雅為基調（暗色系 + 金色點綴），文案用語謹慎。
