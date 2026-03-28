# Project Rules

## 專案概述

線上拜拜 PWA 專案——將華人傳統拜拜習俗數位化（焚香、燒金紙、擲筊、供品擺設等），以環保方式完成儀式。

**技術棧**：Nuxt 4 + shadcn-nuxt + Tailwind CSS 4 + @pinia/nuxt + @vite-pwa/nuxt

## OpenSpec 變更清單與開發順序

12 個 openspec change，各自獨立於 `openspec/changes/` 下。

### 依賴圖

```
setup-project-rules (基礎)
├── user-auth
├── worship-ceremony ─────────────────┐
│   ├── 整合 offering-arrangement     │
│   ├── 整合 incense-simulation       │
│   ├── 整合 divination-blocks        │
│   ├── 整合 joss-paper-burning       │
│   ├── 整合 paper-craft-burning      │
│   └── 顯示 eco-impact-tracker 數據  │
├── eco-impact-tracker                │
│   └── 需要 joss-paper / paper-craft │
│       的焚燒資料來計算              │
├── temple-checkin (獨立)             │
├── i18n (可隨時加入)                 │
└── group-worship ◄───────────────────┘
    └── 擴展 worship-ceremony 為多人版
```

### 建議開發順序

| 階段 | Change | 說明 |
|------|--------|------|
| **Phase 1** | `setup-project-rules` | 所有 change 的前置條件 |
| **Phase 2** (可平行) | `user-auth`, `divination-blocks`, `incense-simulation`, `joss-paper-burning` | 獨立子模組 |
| **Phase 3** (可平行) | `offering-arrangement`, `paper-craft-burning`, `temple-checkin` | offering 依賴 incense 計時連動；paper-craft 共用 joss-paper 粒子引擎；temple-checkin 完全獨立 |
| **Phase 4** | `worship-ceremony` | 串接所有 Phase 2-3 子功能模組成完整儀式流程 |
| **Phase 5** (可平行) | `eco-impact-tracker`, `group-worship` | eco 需儀式完成資料；group 擴展為多人版，需 WebSocket 後端 |
| **Phase 6** | `i18n` | 所有 UI 穩定後再加翻譯 |

**關鍵路徑**：setup-project-rules → Phase 2 子模組 → worship-ceremony → group-worship

## CSS Debug Strategy

CSS debug 時根因優先，不做表層 overflow 遮蓋。遇到溢出問題，先追到最內層造成問題的元素，從源頭修正，不在外層 wrapper 加 overflow-hidden 等補丁。
