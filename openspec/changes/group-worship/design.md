## Context

本變更在 worship-ceremony 的祭祖流程基礎上，擴充多人即時協作層。讓分散各地的家人能透過 PIN 碼加入同一場儀式，由主持人控制流程進度，各參與者在自己的裝置上完成個別操作。

本變更假設 project-setup 與 worship-ceremony 已完成，包含 Vue 3 + Vite 環境、Pinia 狀態管理、儀式流程引擎、路由骨架等基礎設施皆已就緒。

**目標使用者**：台灣地區的一般民眾，多人祭祖場景（家族遠端團拜），以手機使用為主。

**技術限制**：
- 需要後端 WebSocket server 支援即時通訊
- 前端需整合 WebSocket client（socket.io-client 或原生 WebSocket）
- 房間狀態需在 server 端維護，不能僅依賴前端
- 行動網路環境下需處理頻繁斷線與重連

## Goals / Non-Goals

**Goals:**
- 實作 PIN 碼房間建立與加入機制
- 實作主持人與參與者的角色權限區分
- 實作主持人控制流程（設定稱謂/地點、觸發焚香/擲筊、推進步驟）
- 實作參與者個別操作（記錄供品、祈禱、選金紙、選紙紮）與完成狀態同步
- 實作 WebSocket 即時狀態同步，2 秒內更新
- 實作離線偵測、重連恢復與超時移除機制
- 實作房間 2 小時有效期與到期處理

**Non-Goals:**
- 不實作後端 WebSocket server 本身的部署與基礎設施（僅定義前後端通訊協議）
- 不實作語音或視訊通話功能
- 不實作文字聊天功能
- 不實作拜神明模式的多人功能（僅祭祖模式）
- 不修改既有的單人儀式流程邏輯

## Decisions

### 1. WebSocket 通訊方案：socket.io

**選擇**：使用 socket.io-client 作為前端 WebSocket 通訊方案，後端對應使用 socket.io server。

**理由**：
- socket.io 內建自動重連機制（reconnection、reconnectionDelay、reconnectionAttempts），適合行動網路環境
- 內建 Room 概念，天然對應多人房間機制，server 端可直接 `io.to(roomId).emit()` 廣播
- 內建 heartbeat（ping/pong）機制，可用於偵測斷線
- 支援 fallback（WebSocket -> HTTP long-polling），相容性更好
- 生態成熟，文件完善

**替代方案考量**：
- 原生 WebSocket：更輕量但需自行實作重連、心跳、Room 管理等機制，開發成本較高
- Server-Sent Events (SSE)：僅支援 server -> client 單向，不適合雙向互動場景

### 2. 房間狀態管理：Server 端為權威來源

**選擇**：房間狀態（成員列表、當前步驟、各成員完成狀態）以 server 端為唯一權威來源（Single Source of Truth），前端透過事件同步。

**理由**：
- 多人場景下若前端各自維護狀態，容易產生不一致
- Server 端統一管理可確保所有成員看到相同的房間狀態
- 斷線重連時，client 從 server 取得完整狀態即可恢復
- 主持人的控制操作需經 server 驗證權限後才廣播，防止偽造

**前端角色**：
- `useGroupWorshipStore`（Pinia）作為 server 狀態的本地鏡像（cache）
- 收到 server 事件時更新 store，UI 響應式更新
- 使用者操作發送事件至 server，等待 server 確認後才更新本地狀態

### 3. 事件廣播模式：Command + Event 分離

**選擇**：前端發送 Command（請求操作），server 驗證後廣播 Event（狀態變更通知）。

**理由**：
- Command 是意圖（如 `host:advance-step`），Event 是事實（如 `step:changed`）
- Server 可在 Command 階段做權限驗證（如只有主持人可觸發焚香）
- Event 統一廣播給房間所有成員（含發送者），確保狀態一致
- 前端只需監聽 Event 更新 UI，不需區分「自己的操作」與「他人的操作」

**核心事件清單**：

| 方向 | 事件名稱 | 說明 |
|------|----------|------|
| Client -> Server | `room:create` | 建立房間 |
| Client -> Server | `room:join` | 加入房間（附 PIN 碼） |
| Client -> Server | `room:leave` | 離開房間 |
| Client -> Server | `member:ready` | 成員準備完成 |
| Client -> Server | `host:set-title` | 主持人設定稱謂 |
| Client -> Server | `host:set-location` | 主持人設定地點 |
| Client -> Server | `host:advance-step` | 主持人推進步驟 |
| Client -> Server | `host:force-advance` | 主持人強制推進 |
| Client -> Server | `host:skip-offline` | 主持人跳過離線成員 |
| Client -> Server | `host:trigger-incense` | 主持人觸發焚香 |
| Client -> Server | `host:end-ceremony` | 主持人結束儀式 |
| Client -> Server | `participant:complete-step` | 參與者完成當前步驟 |
| Server -> Client | `room:created` | 房間已建立（含 PIN 碼） |
| Server -> Client | `room:joined` | 成員已加入 |
| Server -> Client | `room:member-left` | 成員已離開 |
| Server -> Client | `room:closed` | 房間已關閉 |
| Server -> Client | `room:expiring-soon` | 房間即將到期 |
| Server -> Client | `ceremony:started` | 儀式開始 |
| Server -> Client | `step:changed` | 步驟已推進 |
| Server -> Client | `step:member-completed` | 某成員完成當前步驟 |
| Server -> Client | `member:status-changed` | 成員狀態變更（上線/離線/移除） |
| Server -> Client | `ceremony:title-set` | 稱謂已設定 |
| Server -> Client | `ceremony:location-set` | 地點已設定 |
| Server -> Client | `ceremony:incense-triggered` | 焚香已觸發 |
| Server -> Client | `ceremony:divination-result` | 擲筊結果 |
| Server -> Client | `ceremony:ended` | 儀式結束 |
| Server -> Client | `sync:full-state` | 完整狀態同步（重連用） |

### 4. PIN 碼產生策略

**選擇**：Server 端隨機產生 6 位數字 PIN 碼（100000-999999），碰撞時重試。

**理由**：
- 6 位數提供 900,000 種組合，同時在線房間數量遠低於此，碰撞機率極低
- 純數字方便手機使用者輸入
- Server 端維護一個活躍房間 PIN 碼集合，產生時檢查是否重複

### 5. 多人儀式步驟序列

**選擇**：多人祭祖流程步驟為固定序列，在單人祭祖流程基礎上增加等待同步機制。

**步驟序列**：
1. 等待成員準備（多人獨有）
2. 設定稱謂（主持人操作）
3. 設定地點（主持人操作，可跳過）
4. 記錄供品（各自操作 + 等待全員）
5. 焚香（主持人觸發 + 全員同步）
6. 祈禱（各自操作 + 等待全員）
7. 擲筊（主持人代表操作）
8. 選金紙（各自操作 + 等待全員）
9. 選紙紮（各自操作 + 等待全員）
10. 儀式完成摘要

**步驟類型分類**：
- **主持人獨佔型**：設定稱謂、設定地點、觸發焚香、擲筊——僅主持人可操作，其他成員等待並即時觀看結果
- **各自操作型**：記錄供品、祈禱、選金紙、選紙紮——每位成員獨立操作，完成後等待全員完成
- **同步推進型**：步驟推進由主持人控制，推進時所有成員同步切換

### 6. 斷線處理時序

**選擇**：分級處理斷線情境，避免短暫網路波動影響體驗。

**時序**：
- 0-30 秒：靜默期，不做任何標記（避免短暫斷線干擾）
- 30 秒：標記為「離線」，通知其他成員
- 30 秒 - 5 分鐘：離線狀態，主持人可選擇跳過
- 5 分鐘：自動移除出房間

**重連處理**：
- Client 重連後發送 `room:rejoin`（附帶 roomId 與 memberId）
- Server 驗證成員身份後回傳 `sync:full-state`，包含當前完整房間狀態
- 前端收到完整狀態後覆蓋本地 store，UI 自動同步

## Risks / Trade-offs

### [Risk] WebSocket Server 可用性
多人功能完全依賴 WebSocket server，server 不可用時多人功能無法使用。
-> **Mitigation**：前端在連線失敗時顯示明確的錯誤訊息與重試按鈕；單人模式不受影響，可提示使用者改用單人祭祖。

### [Risk] 行動網路斷線頻繁
行動網路環境不穩定，頻繁斷線可能影響多人儀式體驗。
-> **Mitigation**：socket.io 內建自動重連機制（指數退避策略）；30 秒靜默期避免短暫斷線干擾；重連後完整狀態同步確保不遺失進度。

### [Risk] 主持人斷線導致儀式中斷
主持人是流程控制的唯一角色，斷線會導致其他成員無法推進。
-> **Mitigation**：主持人 5 分鐘離線超時後自動結束儀式並進入摘要。未來可考慮主持人轉移機制（將主持人角色移交給其他成員），但第一版不實作。

### [Risk] 前後端狀態不一致
網路延遲或事件遺失可能導致前端狀態與 server 不同步。
-> **Mitigation**：採用 server 權威模式，前端所有狀態更新都來自 server 事件；定期（每 30 秒）向 server 請求完整狀態同步作為兜底機制。

### [Risk] PIN 碼安全性
6 位數 PIN 碼可能被猜測或暴力嘗試加入。
-> **Mitigation**：Server 端對同一 IP 的加入請求做速率限制（rate limiting）；房間可設定人數上限（建議預設 10 人）；PIN 碼僅在房間有效期內有效。
