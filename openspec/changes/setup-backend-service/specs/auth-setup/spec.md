## ADDED Requirements

### Requirement: Supabase Auth 後端整合
系統 SHALL 使用 Supabase Auth 作為認證服務，後端透過 Supabase service role client 驗證前端傳來的 JWT token。

#### Scenario: 驗證有效的 JWT token
- **WHEN** 前端請求帶有有效的 Supabase JWT token（Authorization header）
- **THEN** auth middleware 成功驗證 token，將 user 資訊附加到 request 上，請求繼續處理

#### Scenario: 驗證無效的 JWT token
- **WHEN** 前端請求帶有無效或過期的 JWT token
- **THEN** auth middleware 回傳 HTTP 401 Unauthorized，請求不繼續處理

#### Scenario: 缺少 JWT token
- **WHEN** 前端請求未帶 Authorization header 且路由需要認證
- **THEN** auth middleware 回傳 HTTP 401 Unauthorized

### Requirement: Supabase Auth 前端設定
系統 SHALL 在前端設定 Supabase client，提供登入/登出功能的基礎設施。

#### Scenario: 前端 Supabase client 初始化
- **WHEN** 前端應用啟動
- **THEN** Supabase client 使用環境變數 `SUPABASE_URL` 與 `SUPABASE_ANON_KEY` 初始化

#### Scenario: 前端取得 JWT token
- **WHEN** 使用者透過 Supabase Auth 登入成功
- **THEN** 前端可取得 JWT token 用於後續 API 請求與 WebSocket 連線

### Requirement: WebSocket 連線認證
系統 SHALL 在 socket.io 連線建立時驗證 JWT token，拒絕未認證的 WebSocket 連線。

#### Scenario: 帶有效 token 建立 WebSocket 連線
- **WHEN** 前端使用 socket.io-client 連線時在 `auth` 參數帶入有效 JWT token
- **THEN** socket.io server 驗證通過，連線成功建立

#### Scenario: 帶無效 token 建立 WebSocket 連線
- **WHEN** 前端使用 socket.io-client 連線時在 `auth` 參數帶入無效 JWT token
- **THEN** socket.io server 驗證失敗，連線被拒絕，client 端收到認證錯誤
