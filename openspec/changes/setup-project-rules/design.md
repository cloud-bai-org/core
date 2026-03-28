## Context

這是一個全新專案，目標是將華人傳統拜拜習俗（燒金紙、焚香、擲筊、供品擺設等）數位化，透過網頁應用讓使用者能在線上或實體廟宇中以環保方式完成儀式。

本變更僅聚焦於專案基礎建設：初始化開發環境、整合基礎套件、建立目錄結構、設計系統，並為所有功能頁面定義路由骨架。各功能的實作將在各自獨立的變更中進行。

**目標使用者**：台灣地區的一般民眾，以手機使用為主。

**技術限制**：
- Nuxt 4 全端框架，前端為主的 PWA 架構，server/ 用於驗證與資料同步
- 需支援行動裝置相機（QR Code 掃描、供品拍照）
- 背景計時需在頁面離開後持續運作

## Goals / Non-Goals

**Goals:**
- 建立完整的 Nuxt 4 開發環境（內建 Vite、file-based routing、auto-import、auto component registration）
- 整合 shadcn-nuxt + Tailwind CSS 4 UI 框架
- 以 Mobile-First PWA 架構為核心，支援安裝至手機桌面與背景推播通知
- 整合 @pinia/nuxt、@vueuse/motion/nuxt + GSAP、@vite-pwa/nuxt 等 Nuxt 模組
- 建立 Nuxt 4 目錄結構與靜態資料骨架
- 建立廟宇莊嚴風格設計系統
- 定義所有功能頁面的路由骨架（空白佔位元件）
- 配置 routeRules 每頁渲染策略

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

### 1. 框架：Nuxt 4

**選擇**：Nuxt 4 作為全端框架

**理由**：
- Nuxt 4 內建 file-based routing、auto-import（Vue/Router/Pinia API + composables/）、auto component registration——省去 unplugin-vue-router、unplugin-auto-import、unplugin-vue-components 三個插件
- 底層使用 Vite，開發體驗一致
- 支援 `routeRules` 可針對每個路由配置不同的渲染策略（prerender / SSR / CSR）
- Nuxt 4 的 `app/` 目錄結構更清晰，與根目錄配置分離

**移除的套件（Nuxt 內建）**：
- ~~unplugin-vue-router~~ → Nuxt file-based routing
- ~~unplugin-auto-import~~ → Nuxt auto-import
- ~~unplugin-vue-components~~ → Nuxt auto component registration
- ~~vue-router（手動安裝）~~ → Nuxt 內建

### 2. UI 框架：shadcn-nuxt + Tailwind CSS 4

**選擇**：shadcn-nuxt 元件庫搭配 Tailwind CSS 4

**理由**：
- shadcn-nuxt 是 shadcn-vue 的 Nuxt 整合版，自動處理元件匯入與 Nuxt 相容性
- 元件原始碼複製到專案中，可完全客製化，適合需要高度設計客製的宗教文化主題
- 底層基於 Radix Vue，提供完整的無障礙支援
- Tailwind CSS 4 的 Oxide 引擎提供更快的建置速度

**設計系統**：採用「台灣廟宇莊嚴風格」深色主題，詳見 [design-guidelines.md](./specs/project-setup/design-guidelines.md)
- 主色 **絳紅** (#9E2A2B)、**琉璃金** (#D4AF37)、**蒼綠** (#2D6A59)
- 背景 **玄黑** (#1C1919)，文字 **香灰白** (#F0EBE1)
- 字體 Noto Sans TC，圓角 0.35rem 維持莊重感

### 3. 應用架構：Nuxt 4 Hybrid Rendering + PWA

**選擇**：Nuxt 4 搭配 `routeRules` 混合渲染策略 + PWA 配置

**理由**：
- 不同頁面有不同需求：首頁適合 prerender（SEO）、儀式互動頁面適合 CSR（效能）、有數據的頁面適合 SSR
- PWA 提供 Service Worker 支援背景計時與推播通知
- 可安裝至手機桌面，接近原生 App 體驗
- 使用 `@vite-pwa/nuxt` 整合 PWA 配置

**routeRules 配置**：
```
路由                  策略              理由
/                     prerender         首頁固定內容，SEO 友善
/login                ssr: false        純互動，不需 SEO
/settings             ssr: false        使用者私人頁面
/eco-impact           ssr: true         有數據內容，可 SEO
/worship/**           ssr: false        儀式互動重，全 CSR
/temple/**            ssr: false        相機/GPS 功能，CSR
/group/**             ssr: false        WebSocket 互動，CSR
```

### 4. 狀態管理：@pinia/nuxt

**選擇**：@pinia/nuxt 作為全域狀態管理方案

**理由**：
- @pinia/nuxt 自動註冊 Pinia，自動掃描 `stores/` 目錄
- API 簡潔，支援 TypeScript 類型推導
- 搭配 pinia-plugin-persistedstate 實現訪客模式的本機暫存
- 支援 Vue DevTools，開發除錯方便

### 5. 動畫引擎：@vueuse/motion/nuxt + GSAP

**選擇**：雙引擎分層策略——@vueuse/motion 處理元件級動畫，GSAP 處理複雜儀式動畫

**理由**：
- **@vueuse/motion/nuxt**：Nuxt 模組整合，提供 `v-motion` 指令，適合元件進出場、hover 效果等日常 UI 動畫
- **GSAP**：透過 Nuxt plugin 註冊，處理複雜的儀式動畫場景，支援時間軸序列（timeline）、精確控制進度與物理緩動
- 分層明確：元件動畫用 motion、儀式動畫用 GSAP，各司其職

### 6. 路由骨架：Nuxt 檔案式路由

**選擇**：在 `app/pages/` 建立對應的 `.vue` 檔案，由 Nuxt 自動產生路由設定。

**路由結構規劃**：
```
app/pages/
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

### 7. 專案目錄結構（Nuxt 4）

**選擇**：依照 Nuxt 4 慣例組織目錄

```
cloud-bai-core/
  ├── app/                      # Nuxt 4 app 目錄
  │   ├── app.vue               # 根元件
  │   ├── pages/                # 檔案式路由頁面（Nuxt 內建）
  │   ├── components/           # 所有元件（Nuxt 自動註冊）
  │   │   └── ui/               # shadcn-nuxt 生成的元件
  │   ├── composables/          # Composables（Nuxt 自動 import）
  │   ├── layouts/              # Nuxt layout 系統
  │   ├── plugins/              # Nuxt plugins（GSAP 等）
  │   └── assets/
  │       └── css/
  │           └── main.css      # Tailwind + 主題 tokens
  ├── stores/                   # Pinia stores（@pinia/nuxt 自動掃描）
  ├── types/                    # TypeScript 型別定義
  ├── data/                     # 靜態資料（神明、廟宇、供品 JSON）
  ├── locales/                  # i18n 翻譯檔（預留目錄）
  ├── server/                   # Nuxt server（暫時空）
  ├── public/                   # 靜態檔案
  ├── nuxt.config.ts            # 統一配置入口
  └── package.json
```

### 8. 廟宇與神明資料：靜態 JSON

**選擇**：第一版使用靜態 JSON 檔案儲存廟宇、神明、參拜路線資料

**理由**：
- 初始版本資料量有限，不需要完整的 CMS
- JSON 可版控，修改透明
- 預留資料結構設計，未來可無縫遷移至 API

**重要**：廟宇名稱一律使用自訂虛構名稱，不使用現實中既有的廟宇名稱。

## Risks / Trade-offs

### [Risk] Nuxt 4 穩定性
Nuxt 4 為最新版本，可能存在尚未發現的 bug 或 breaking changes。
→ **Mitigation**：密切追蹤 Nuxt 4 release notes，必要時可快速回退到 Nuxt 3 + compatibilityVersion: 4。

### [Risk] 路由結構可能在功能開發時需要調整
功能開發過程中可能發現需要新增、移除或重組路由。
→ **Mitigation**：Nuxt 檔案式路由本身就容易調整（新增/移動/刪除 .vue 檔案即可），此風險影響極低。

### [Risk] 佔位元件可能被遺留未實作
空白佔位頁面如果沒有對應的功能變更來覆蓋，可能被遺留。
→ **Mitigation**：每個佔位頁面清楚標示對應的 capability 名稱，方便追蹤。

### [Risk] 文化敏感度
涉及宗教信仰內容，UI/UX 設計需莊重得體，避免戲謔或冒犯。
→ **Mitigation**：UI/UX 設計以莊嚴、典雅為基調（暗色系 + 金色點綴），文案用語謹慎。
