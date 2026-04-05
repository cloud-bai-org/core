## ADDED Requirements

### Requirement: socket.io 整合至 Fastify
系統 SHALL 在 Fastify plugin 中初始化 socket.io server，掛載於 Fastify 底層 HTTP server，並以 `app.io` 形式提供給其他 plugin。

#### Scenario: socket.io server 啟動
- **WHEN** Fastify 服務啟動且 socket plugin 註冊完成
- **THEN** socket.io server 成功掛載，可接受 WebSocket 連線

#### Scenario: 前端可建立 WebSocket 連線
- **WHEN** 前端使用 socket.io-client 連線至後端服務
- **THEN** WebSocket 連線成功建立，server 端觸發 `connection` 事件

#### Scenario: 其他 plugin 可使用 io 實例
- **WHEN** 其他 Fastify plugin 需要發送 WebSocket 事件
- **THEN** 可透過 `app.io` 取得 socket.io Server 實例進行操作

### Requirement: CORS 設定
系統 SHALL 為 socket.io 設定 CORS，允許前端開發伺服器的 origin 連線。

#### Scenario: 開發環境 CORS 允許
- **WHEN** 前端從 `localhost:3000` 建立 WebSocket 連線至後端 `localhost:3001`
- **THEN** 連線成功，不被 CORS 策略阻擋

### Requirement: 服務關閉時清理連線
系統 SHALL 在 Fastify 服務關閉時，正確關閉 socket.io server 與所有 WebSocket 連線。

#### Scenario: 服務優雅關閉
- **WHEN** Fastify 服務收到關閉信號（SIGTERM / SIGINT）
- **THEN** socket.io server 關閉所有連線後，Fastify 服務完成關閉
