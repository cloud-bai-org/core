## Group 1：焚香狀態管理與 IndexedDB 持久化

- [ ] 1.1 建立 `useIncenseStore`（Pinia），定義焚香狀態結構（phase: idle/lighting/burning/completed、startTime、endTime、remainingRatio）
- [ ] 1.2 實作 IndexedDB 存取層，支援寫入與讀取焚香計時結束時間戳
- [ ] 1.3 實作焚香開始邏輯：記錄開始時間、計算結束時間戳、寫入 IndexedDB
- [ ] 1.4 實作頁面可見性變更監聽（visibilitychange），回到頁面時從 IndexedDB 讀取時間戳並同步狀態

## Group 2：點香與焚香動畫

- [ ] 2.1 實作點香火焰動畫元件（CSS Animation），點擊「點香」按鈕後觸發火焰點燃效果
- [ ] 2.2 實作 Canvas 煙霧粒子系統，支援煙霧從香頂端持續飄散
- [ ] 2.3 實作香體長度遞減動畫，根據 remainingRatio 動態調整香的視覺長度
- [ ] 2.4 整合動畫與狀態：lighting 階段播放點燃動畫，burning 階段播放煙霧與遞減，completed 階段停止動畫
- [ ] 2.5 實作動畫進度恢復：頁面回到前景時根據剩餘時間跳轉至正確的動畫進度

## Group 3：Service Worker 背景計時與推播通知

- [ ] 3.1 擴充 Service Worker，新增焚香計時訊息處理（接收計時開始指令、設定 setTimeout 觸發通知）
- [ ] 3.2 實作 Web Notification API 整合：焚香開始前請求通知權限，計時結束時發送「香已燃畢」通知
- [ ] 3.3 實作通知點擊處理：點擊通知後開啟應用頁面並導向焚香完成狀態
- [ ] 3.4 實作不支援通知的降級方案：使用者回到頁面時顯示 In-App 提示（toast 或 modal）

## Group 4：焚香完成與流程整合

- [ ] 4.1 實作焚香完成畫面，顯示焚香完成狀態
- [ ] 4.2 串接焚香功能至拜拜儀式流程，作為適當步驟的一環
- [ ] 4.3 實作低階裝置效能適配：偵測裝置效能，動態調整 Canvas 粒子數量
