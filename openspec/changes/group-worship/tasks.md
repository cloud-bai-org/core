## Group 1：WebSocket 連線基礎建設

- [ ] 1.1 安裝 socket.io-client 依賴，建立 `src/services/socket.ts` 封裝 WebSocket 連線管理（連線、斷線、自動重連、事件監聽/發送）
- [ ] 1.2 實作連線狀態管理：建立 `useSocketStore`（Pinia）追蹤連線狀態（connected / disconnected / reconnecting），UI 可響應式顯示連線指示器
- [ ] 1.3 實作自動重連機制：配置 socket.io reconnection 參數（指數退避策略），重連成功後自動觸發房間重新加入流程
- [ ] 1.4 實作心跳偵測與連線品質監控：監聽 socket.io ping/pong 事件，偵測延遲異常時顯示提示

## Group 2：房間建立與加入

- [ ] 2.1 建立 `useGroupWorshipStore`（Pinia），定義房間狀態結構（roomId、pin、members、currentStep、hostId、ceremonyData、roomExpiry）
- [ ] 2.2 實作建立房間頁面 UI：在祭祖模式下顯示「多人拜拜」入口，點擊後發送 `room:create` 事件，顯示產生的 6 位數 PIN 碼與等待成員加入畫面
- [ ] 2.3 實作加入房間頁面 UI：提供 6 位數 PIN 碼輸入介面，驗證格式後發送 `room:join` 事件，處理成功/失敗回饋
- [ ] 2.4 實作成員等待大廳 UI：顯示已加入成員列表與各成員準備狀態，主持人可見「開始儀式」按鈕（全員準備後啟用）
- [ ] 2.5 實作成員準備機制：參與者點擊「準備」按鈕發送 `member:ready` 事件，監聽 `room:joined` 與 `member:status-changed` 事件更新成員列表

## Group 3：主持人控制流程

- [ ] 3.1 實作角色權限判斷邏輯：根據 `useGroupWorshipStore` 中的 hostId 判斷當前使用者是否為主持人，封裝 `isHost` computed 屬性供各頁面使用
- [ ] 3.2 實作稱謂設定步驟 UI：主持人顯示輸入欄位，發送 `host:set-title` 事件；參與者顯示等待畫面，監聽 `ceremony:title-set` 事件後顯示結果
- [ ] 3.3 實作地點設定步驟 UI：主持人顯示地點選項與自由輸入，發送 `host:set-location` 事件或跳過；參與者顯示等待畫面，監聽 `ceremony:location-set` 事件
- [ ] 3.4 實作主持人觸發焚香 UI：主持人點擊「點香」發送 `host:trigger-incense` 事件，監聽 `ceremony:incense-triggered` 事件後所有成員同步啟動焚香動畫與計時
- [ ] 3.5 實作主持人擲筊步驟 UI：僅主持人可操作擲筊互動，發送擲筊結果至 server；參與者即時觀看擲筊動畫，監聽 `ceremony:divination-result` 事件顯示結果
- [ ] 3.6 實作步驟推進控制：主持人「下一步」按鈕發送 `host:advance-step` 事件，監聽 `step:changed` 事件推進所有成員的步驟
- [ ] 3.7 實作強制推進與跳過離線成員：主持人「強制推進」發送 `host:force-advance`，「跳過離線成員」發送 `host:skip-offline`，更新等待條件

## Group 4：參與者個別操作與等待同步

- [ ] 4.1 實作多人供品記錄步驟 UI：複用單人供品記錄元件，完成後發送 `participant:complete-step` 事件（stepId: offering），顯示其他成員完成進度
- [ ] 4.2 實作多人祈禱步驟 UI：複用單人祈禱元件，完成或跳過後發送 `participant:complete-step` 事件（stepId: prayer），顯示其他成員完成進度
- [ ] 4.3 實作多人金紙選擇步驟 UI：複用單人金紙選擇元件，完成後發送 `participant:complete-step` 事件（stepId: joss-paper），顯示其他成員完成進度
- [ ] 4.4 實作多人紙紮選擇步驟 UI：複用單人紙紮選擇元件，完成後發送 `participant:complete-step` 事件（stepId: paper-craft），顯示其他成員完成進度
- [ ] 4.5 實作等待全員完成 UI 元件：通用的等待元件，顯示已完成/未完成成員列表、完成百分比進度條，主持人可見「強制推進」按鈕
- [ ] 4.6 監聽 `step:member-completed` 事件，即時更新各成員在當前步驟的完成狀態

## Group 5：即時狀態同步與事件處理

- [ ] 5.1 實作事件監聽中樞：在 `useGroupWorshipStore` 中集中註冊所有 server -> client 事件監聽器，收到事件後更新對應的 store 狀態
- [ ] 5.2 實作完整狀態同步：監聽 `sync:full-state` 事件，用 server 回傳的完整狀態覆蓋本地 store（用於重連場景）
- [ ] 5.3 實作定期狀態同步兜底機制：每 30 秒向 server 請求完整狀態同步，與本地狀態比對，若不一致則以 server 為準更新
- [ ] 5.4 實作成員狀態變更處理：監聽 `member:status-changed` 事件，更新成員列表中的上線/離線/移除狀態與 UI 提示

## Group 6：離開、斷線與房間生命週期

- [ ] 6.1 實作主動離開房間功能：參與者點擊「離開房間」確認後發送 `room:leave` 事件，導航回首頁；監聽 `room:member-left` 事件更新成員列表
- [ ] 6.2 實作斷線重連流程：socket 重連成功後自動發送 `room:rejoin`（附 roomId 與 memberId），監聽 `sync:full-state` 恢復狀態
- [ ] 6.3 實作離線成員 UI 標記：成員列表中離線成員顯示灰色狀態與「離線」標籤，主持人可見「跳過」按鈕
- [ ] 6.4 實作房間到期處理：監聽 `room:expiring-soon` 事件顯示倒數提醒，監聽 `room:closed` 事件導航至摘要頁面
- [ ] 6.5 實作主持人斷線處理 UI：主持人離線時顯示「等待主持人重連」提示，超時後監聽 `ceremony:ended` 事件進入摘要

## Group 7：多人儀式完成摘要

- [ ] 7.1 實作多人儀式摘要頁面 UI：顯示共用資訊（祭拜對象、地點、擲筊結果）與各成員個別紀錄（供品、金紙、紙紮）
- [ ] 7.2 實作摘要資料組裝邏輯：從 `useGroupWorshipStore` 中彙整所有成員的步驟資料，計算合計環保成效
- [ ] 7.3 實作已登入使用者保存多人儀式紀錄：將個人在本次多人儀式中的紀錄保存至帳號
