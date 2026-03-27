## Why

拜拜儀式是整個應用的核心功能。使用者需要一個完整的數位化儀式流程，涵蓋「拜神明」與「祭拜祖先/親人」兩種模式，從選擇祭拜對象、擺設供品、焚香、祈禱到完成摘要，每一步都有明確的引導與狀態管理。焚香採非阻塞設計，讓使用者不必等待即可繼續祈禱；已登入使用者刷新頁面後可恢復進度，確保儀式體驗不中斷。

## What Changes

- 新增祭拜對象選擇畫面，提供「拜神明」與「祭拜祖先/親人」兩種模式
- 新增拜神明流程：掃描廟宇 QR Code → 選擇神明 → 擺設供品 → 焚香 → 祈禱 → 擲筊 → 燒金紙
- 新增祭祖流程：輸入對象稱謂 → 選填祭拜地點 → 記錄供品（拍照） → 焚香 → 祈禱 → 燒金紙 → 燒紙紮物品
- 新增焚香非阻塞步驟，點香後背景持續計時，使用者可立即進入祈禱或留下觀看動畫
- 新增祈禱步驟，支援自由輸入祈願內容（可選填）
- 新增儀式完成摘要頁面，顯示祭拜對象、供品、擲筊結果、金紙種類與環保成效
- 新增 Pinia 儀式狀態管理，已登入使用者刷新頁面可恢復進度，訪客不保存

## Capabilities

### New Capabilities
- `worship-ceremony`: 拜拜儀式完整流程——兩種祭拜模式（拜神明/祭祖）、步驟進度指示器、焚香非阻塞計時、祈禱輸入、儀式完成摘要、Pinia 狀態管理與已登入使用者刷新恢復

### Modified Capabilities
_無_

## Impact

- **前端狀態管理**：新增 `useWorshipStore`（Pinia）管理儀式流程狀態、當前步驟、各步驟資料與焚香計時
- **本機儲存**：已登入使用者使用 IndexedDB 保存儀式進度與焚香結束時間戳，供刷新恢復使用
- **頁面路由**：實作 `src/pages/worship/` 下已定義的路由骨架頁面（index、deity-select、ancestor-setup、offering、incense、prayer、divination、joss-paper、paper-craft、summary）
- **相依功能**：依賴 project-setup 建立的基礎架構、路由骨架、設計系統與靜態資料結構
- **外部依賴**：需整合 incense-simulation（焚香動畫）、joss-paper-burning（金紙焚燒）、offering-arrangement（供品擺設）、divination-blocks（擲筊）、paper-craft-burning（紙紮焚燒）等功能模組
