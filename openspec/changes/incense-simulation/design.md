## Context

線上拜拜應用需要模擬點香與焚香的完整視覺體驗。焚香過程涉及即時動畫、長時間計時、背景運作與推播通知等多項技術整合。使用者可能在焚香過程中離開頁面，系統需確保計時不中斷，並在適當時機通知使用者。

前置依賴：`setup-project-rules` 已完成專案基礎建設。

## Goals

- 以流暢動畫模擬點香與焚香過程，包含火焰、煙霧與香長度遞減
- 焚香計時支援背景持續運作，使用者離開頁面不中斷
- 計時結束透過推播通知提醒使用者
- 使用者回到頁面時自動恢復正確的焚香進度或完成狀態

## Non-Goals

- 不同香的種類選擇（如檀香、沉香等視覺差異，未來擴充）
- 焚香音效（音效系統另案處理）
- 焚香紀錄持久化至雲端（依賴 user-auth 完成後整合）

## Decisions

### Decision 1：動畫技術選型
**選擇**：CSS Animation + Canvas 煙霧粒子

**理由**：
- 香體與火焰使用 CSS Animation 即可實現，開發成本低且效能佳
- 煙霧飄散效果需要大量粒子，Canvas 渲染效能優於 DOM 操作
- 與既有 joss-paper-burning 的 Canvas 粒子引擎可共用基礎架構

**替代方案**：
- 純 CSS Animation：煙霧粒子數量受限，效果不夠自然
- WebGL / Three.js：效果最佳但學習成本高，對此場景過於複雜
- Lottie 動畫：預錄動畫無法根據剩餘時間動態調整進度

### Decision 2：背景計時策略
**選擇**：IndexedDB 時間戳 + Service Worker 計時器

**理由**：
- IndexedDB 記錄計時結束時間戳，頁面重新開啟時可直接比對，無需依賴持續運行的計時器
- Service Worker 負責在背景觸發通知，不依賴頁面存活
- 兩者結合可覆蓋「頁面關閉」與「瀏覽器完全退出」兩種情境

**替代方案**：
- localStorage + setInterval：頁面關閉即停止，無法背景運作
- 伺服器端計時 + Push API：需要後端支援，增加基礎設施成本

### Decision 3：焚香狀態管理
**選擇**：Pinia useIncenseStore 集中管理焚香狀態

**理由**：
- 狀態包含：焚香階段（idle / lighting / burning / completed）、開始時間、結束時間、剩餘比例
- 響應式狀態驅動動畫進度，UI 自動反映狀態變化
- 頁面可見性變更（visibilitychange 事件）時觸發狀態同步

### Decision 4：推播通知降級策略
**選擇**：Web Notification API 為主，In-App 提示為降級方案

**理由**：
- Web Notification API 支援度已涵蓋主流瀏覽器
- 不支援的平台（如部分 iOS Safari 版本）使用 In-App 提示作為降級
- 通知權限請求在焚香開始前觸發，避免干擾儀式流程

## Risks / Trade-offs

- **Service Worker 支援度**：部分舊版瀏覽器或限制性環境可能不支援 Service Worker。緩解措施：降級為純 IndexedDB 時間戳比對，頁面重開時自動恢復。
- **iOS Safari 推播限制**：iOS Safari 對 Web Push 支援有版本限制。緩解措施：In-App 提示降級，使用者回到頁面時立即顯示結果。
- **Canvas 效能**：低階裝置上大量煙霧粒子可能造成卡頓。緩解措施：根據裝置效能動態調整粒子數量，提供簡約模式。
- **計時精度**：Service Worker 的 setTimeout 在不同瀏覽器中精度不一。緩解措施：以 IndexedDB 時間戳為最終依據，Service Worker 僅作為通知觸發器。
