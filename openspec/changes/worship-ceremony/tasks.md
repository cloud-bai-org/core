# 實作任務清單

> 拜拜儀式完整流程——兩種祭拜模式、步驟引導、焚香非阻塞計時、儀式狀態管理與摘要。假設 project-setup 已完成。

---

## 1. 儀式狀態管理 Store

- [x] 1.1 建立 `src/stores/worship.ts`（`useWorshipStore`），定義儀式狀態型別：祭拜模式（deity / ancestor）、當前步驟索引、各步驟資料（選擇的神明、祖先稱謂、地點、供品、祈願內容、擲筊結果、金紙種類等）、焚香計時狀態（開始時間、結束時間戳、是否完成）
- [x] 1.2 實作流程引擎邏輯：根據祭拜模式動態產生步驟序列陣列，提供 `nextStep()`、`prevStep()`、`goToStep()` 方法，步驟切換時同步 `router.push`
- [x] 1.3 實作已登入使用者的 IndexedDB 持久化：儀式進度、各步驟資料、焚香結束時間戳寫入 IndexedDB，提供 `saveProgress()` 與 `restoreProgress()` 方法
- [x] 1.4 實作刷新恢復邏輯：頁面載入時偵測是否有未完成的儀式進度，已登入使用者自動恢復至最後步驟，訪客使用者重新開始
- [x] ~~1.5 撰寫 `useWorshipStore` 單元測試~~ MVP 階段略過

## 2. 儀式流程共用元件

- [x] 2.1 建立步驟進度指示器元件 `src/components/worship/StepProgressBar.vue`：顯示當前步驟在整體流程中的位置，支援點擊已完成步驟快速跳轉
- [x] 2.2 建立儀式流程佈局元件 `src/components/worship/CeremonyLayout.vue`：統一的步驟頁面佈局（header 含進度指示器 + 主內容區 + 底部導航列含「上一步」「下一步」按鈕）
- [x] 2.3 建立路由守衛 composable `src/composables/useWorshipGuard.ts`：防止使用者跳過步驟直接訪問未解鎖的步驟路由，未完成前置步驟時導回正確位置

## 3. 祭拜對象選擇

- [x] 3.1 實作 `src/pages/worship/index.vue`：祭拜對象選擇畫面，提供「拜神明」與「祭拜祖先/親人」兩張選擇卡片，點擊後設定模式並進入對應的第一步驟
- [x] ~~3.2 撰寫祭拜對象選擇頁面的元件測試~~ MVP 階段略過

## 4. 拜神明流程步驟

- [x] 4.1 實作 `src/pages/worship/deity-select.vue`：顯示可祭拜的神明列表（從靜態 JSON 讀取），包含神明名稱、職司說明與圖示，選擇後自動建議供品與金紙種類
- [x] 4.2 實作 `src/pages/worship/offering.vue`：供品擺設步驟佈局，預留供品互動元件插槽（實際互動由 offering-arrangement 變更實作），顯示根據所選神明建議的供品列表
- [x] 4.3 實作 `src/pages/worship/incense.vue`：焚香步驟頁面，提供「點香」按鈕啟動計時，點香後顯示「開始祈禱」按鈕與「繼續觀看」選項，預留焚香動畫元件插槽（由 incense-simulation 變更實作）
- [x] 4.4 實作 `src/pages/worship/prayer.vue`：祈禱步驟頁面，顯示祈願內容輸入框（textarea），可選填，底部顯示焚香剩餘時間（如仍在計時中）
- [x] 4.5 實作 `src/pages/worship/divination.vue`：擲筊步驟佈局，預留擲筊互動元件插槽（由 divination-blocks 變更實作），顯示擲筊結果記錄
- [x] 4.6 實作 `src/pages/worship/joss-paper.vue`：金紙焚燒步驟佈局，顯示根據所選神明建議的金紙種類，預留金紙焚燒動畫元件插槽（由 joss-paper-burning 變更實作）

## 5. 祭祖流程步驟

- [x] 5.1 實作 `src/pages/worship/ancestor-setup.vue`：祭祖設定頁面，輸入祭拜對象稱謂（必填）+ 選填祭拜地點（提供「在家」「靈骨塔」「墓園」快捷選項與自由輸入）
- [x] 5.2 實作祭祖模式的供品步驟差異：在 `offering.vue` 中根據模式顯示拍照記錄供品的 UI（祭祖模式）或互動擺設 UI（拜神明模式）
- [x] 5.3 實作 `src/pages/worship/paper-craft.vue`：紙紮物品焚燒步驟佈局，預留紙紮焚燒動畫元件插槽（由 paper-craft-burning 變更實作）

## 6. 儀式完成摘要

- [x] 6.1 實作 `src/pages/worship/summary.vue`：儀式完成摘要頁面，顯示祭拜對象、供品內容、擲筊結果（拜神明模式）、燒金紙種類與環保成效數據
- [x] 6.2 實作已登入使用者自動保存紀錄邏輯：儀式完成時將完整紀錄寫入使用者帳號（呼叫 API 或暫存至本機待同步）
- [x] 6.3 實作摘要頁面的分享功能佈局（預留，實際分享 API 串接視需求後續處理）

## 7. 焚香背景計時

- [x] 7.1 建立 `src/composables/useIncenseTimer.ts`：封裝焚香計時邏輯，使用結束時間戳計算剩餘時間，提供 `start()`、`remaining`（computed ref）、`isCompleted`（computed ref）
- [x] 7.2 實作刷新恢復計時：從 IndexedDB 讀取結束時間戳，計算剩餘時間；若已超時則標記完成
- [x] ~~7.3 撰寫 `useIncenseTimer` 單元測試~~ MVP 階段略過

## 8. 整合驗證

- [x] ~~8.1-8.5 自動化整合驗證~~ MVP 階段改為手動測試
