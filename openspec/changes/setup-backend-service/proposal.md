## Why

專案目前是純前端 Nuxt 4 應用，但多個功能需要後端支撐——group-worship 需要 WebSocket 即時通訊、user-auth 需要第三方登入與 session 管理、儀式紀錄與環保成效需要持久化儲存。需要建立後端服務的基礎架構，作為這些功能的共同基礎設施。

## What Changes

- 將專案轉為 pnpm workspace monorepo 結構（`app/`、`server/`、`packages/shared/`）
- 新增 Fastify 後端服務，包含 plugin 架構骨架、開發/啟動腳本
- 整合 socket.io 至 Fastify，提供 WebSocket 即時通訊基礎
- 整合 Drizzle ORM + PostgreSQL（Supabase），提供資料庫操作基礎
- 整合 Supabase Auth，提供第三方登入基礎
- 建立 `@cloud-bai/shared` 共用型別套件，供前後端共用事件定義與資料模型
- 設定 root-level 開發腳本，一個指令同時啟動前後端

## Capabilities

### New Capabilities
- `backend-infrastructure`: 後端服務基礎架構——Fastify 服務骨架、pnpm workspace monorepo 結構、開發腳本、共用型別套件
- `database-setup`: 資料庫基礎設施——Drizzle ORM 設定、PostgreSQL 連線（Supabase）、migration 機制、基礎 schema
- `websocket-setup`: WebSocket 基礎設施——socket.io 整合至 Fastify、連線管理、事件框架
- `auth-setup`: 認證基礎設施——Supabase Auth 整合、session 驗證 middleware、前端 auth client 設定

### Modified Capabilities
- `project-setup`: 從單一 Nuxt 專案轉為 monorepo 結構，調整 pnpm 設定與開發腳本

## Impact

- **專案結構**：根目錄新增 `pnpm-workspace.yaml`，現有 Nuxt 專案移入 `app/` 或保持原位並在 workspace 中宣告
- **新增依賴**：`fastify`、`socket.io`、`drizzle-orm`、`@supabase/supabase-js`、`@cloud-bai/shared`（workspace package）
- **開發流程**：`pnpm dev` 改為同時啟動前後端服務
- **環境變數**：新增 `SUPABASE_URL`、`SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`、`DATABASE_URL` 等後端環境變數
- **部署**：前端與後端需各自部署，後端需長駐 Node.js process（不適用 serverless）
