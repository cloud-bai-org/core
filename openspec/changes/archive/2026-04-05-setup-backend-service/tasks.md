## 1. Monorepo 結構建立

- [x] 1.1 建立 `pnpm-workspace.yaml`，宣告 `server/`、`packages/shared/` 為 workspace packages
- [x] 1.2 在根目錄 `package.json` 新增 `dev`、`dev:server`、`dev:app` 腳本，`dev` 同時啟動前後端
- [x] 1.3 確認現有 Nuxt 專案在 workspace 中正常運作（`pnpm dev:app` 可啟動）

## 2. 共用型別套件 @cloud-bai/shared

- [x] 2.1 建立 `packages/shared/` 目錄結構，包含 `package.json`（name: `@cloud-bai/shared`）與 `tsconfig.json`
- [x] 2.2 建立 `packages/shared/src/index.ts` 作為匯出入口，放入基礎型別佔位（如 `HealthResponse`）
- [x] 2.3 在 `server/` 與前端的 `package.json` 中加入 `"@cloud-bai/shared": "workspace:*"` 依賴

## 3. Fastify 後端服務骨架

- [x] 3.1 建立 `server/` 目錄結構：`package.json`、`tsconfig.json`、`src/app.ts`
- [x] 3.2 安裝 Fastify 核心依賴（`fastify`、`@fastify/cors`）與 TypeScript 開發依賴（`tsx`、`typescript`）
- [x] 3.3 實作 `src/app.ts`：建立 Fastify instance，依序註冊 plugins，啟動 server 於 port 3001
- [x] 3.4 實作 `src/routes/health.ts`：`GET /health` 回傳 `{ status: "ok" }`
- [x] 3.5 設定 `server/package.json` 的 `dev` 腳本（使用 `tsx watch` 提供熱重載）

## 4. Database Plugin（Drizzle + Supabase PG）

- [x] 4.1 安裝資料庫依賴（`drizzle-orm`、`postgres`、`drizzle-kit`）
- [x] 4.2 實作 `src/plugins/database.ts`：建立 Drizzle instance，decorate 為 `app.db`，註冊 onClose hook 關閉連線
- [x] 4.3 建立 `server/src/schema/index.ts` 作為 schema 統一匯出入口
- [x] 4.4 建立 `server/drizzle.config.ts` 設定 drizzle-kit（migration 目錄、schema 路徑、連線資訊）
- [x] 4.5 建立 `.env.example` 列出所有需要的環境變數（`DATABASE_URL`、`SUPABASE_URL`、`SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`）

## 5. WebSocket Plugin（socket.io）

- [x] 5.1 安裝 socket.io 依賴（`socket.io`）
- [x] 5.2 實作 `src/plugins/socket.ts`：初始化 socket.io Server，掛載到 Fastify HTTP server，decorate 為 `app.io`，設定 CORS 允許前端 origin
- [x] 5.3 註冊 onClose hook，服務關閉時清理 socket.io 連線
- [x] 5.4 新增基礎 `connection` 事件監聽，連線成功時 log 輸出

## 6. Auth Plugin（Supabase Auth）

- [x] 6.1 安裝 Supabase 依賴（`@supabase/supabase-js`）
- [x] 6.2 實作 `src/plugins/auth.ts`：初始化 Supabase client（service role），decorate `app.supabase` 與 `app.verifyAuth` hook
- [x] 6.3 `verifyAuth` hook：從 Authorization header 取得 JWT，透過 Supabase 驗證，失敗回傳 401
- [x] 6.4 在 socket.io 連線時加入 JWT 驗證 middleware，拒絕未認證的 WebSocket 連線

## 7. 前端 Supabase Client 設定

- [x] 7.1 在前端安裝 `@supabase/supabase-js`
- [x] 7.2 建立 Nuxt plugin 初始化 Supabase client，使用 runtime config 注入 `SUPABASE_URL` 與 `SUPABASE_ANON_KEY`
- [x] 7.3 建立 `useSupabaseAuth` composable，提供登入狀態與 JWT token 存取

## 8. 驗證與整合

- [x] 8.1 從根目錄執行 `pnpm dev` 確認前後端同時啟動
- [x] 8.2 確認 `GET http://localhost:3001/health` 回傳正常
- [x] 8.3 確認前端可建立 socket.io 連線至後端
- [x] 8.4 確認 `@cloud-bai/shared` 的型別在前後端均可正確 import
