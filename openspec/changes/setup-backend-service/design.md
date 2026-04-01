## Context

目前專案是單一 Nuxt 4 前端應用，所有程式碼在同一個 package 中。隨著 group-worship（WebSocket 即時多人）、user-auth（第三方登入）、儀式紀錄持久化等需求浮現，需要一個獨立的後端服務。

本變更的目標是建立後端基礎設施，讓後續功能（group-worship、user-auth、eco-impact-tracker 等）有共同的技術基底可以建構。

**目標使用者**：開發者（自己），建立可擴展的開發環境。

**技術限制**：
- 需要長駐 Node.js process（WebSocket 不適合 serverless）
- 前後端共用 TypeScript 型別
- 單人開發，需要簡單的開發流程

## Goals / Non-Goals

**Goals:**
- 建立 pnpm workspace monorepo 結構，前後端共存
- 建立 Fastify 後端服務骨架（plugin 架構、生命週期 hook）
- 整合 socket.io 至 Fastify，提供 WebSocket 連線基礎
- 整合 Drizzle ORM + Supabase PostgreSQL，提供資料庫操作基礎與 migration 機制
- 整合 Supabase Auth，提供認證 middleware
- 建立 `@cloud-bai/shared` 共用型別套件
- 設定開發腳本，一個指令同時啟動前後端

**Non-Goals:**
- 不實作具體的業務邏輯（房間管理、儀式流程等屬於各自的 change）
- 不設定正式環境的 CI/CD pipeline
- 不實作完整的 API 端點（僅提供健康檢查端點驗證服務運作）
- 不設定 Docker 容器化（MVP 階段不需要）

## Decisions

### 1. Monorepo 結構：pnpm workspace

**選擇**：使用 pnpm workspace 管理 monorepo，保持現有 Nuxt 專案在根目錄，後端服務放在 `server/`，共用型別放在 `packages/shared/`。

**結構**：
```
cloud-bai-core/
├── pnpm-workspace.yaml
├── package.json            ← root scripts（dev、build）
├── nuxt.config.ts          ← 現有前端維持原位
├── app/                    ← 現有前端程式碼
├── server/                 ← Fastify 後端
│   ├── package.json
│   ├── src/
│   │   ├── app.ts          ← Fastify 入口，註冊 plugins
│   │   ├── plugins/
│   │   │   ├── database.ts ← Drizzle + Supabase PG
│   │   │   ├── socket.ts   ← socket.io 初始化
│   │   │   └── auth.ts     ← Supabase Auth middleware
│   │   ├── schema/         ← Drizzle schema 定義
│   │   └── routes/
│   │       └── health.ts   ← 健康檢查端點
│   ├── drizzle.config.ts
│   └── tsconfig.json
└── packages/
    └── shared/
        ├── package.json    ← name: @cloud-bai/shared
        ├── src/
        │   └── index.ts
        └── tsconfig.json
```

**理由**：
- 現有前端維持原位，避免搬移大量檔案導致 git history 斷裂
- pnpm workspace 原生支援，不需額外工具（turborepo、nx）
- 共用型別透過 workspace protocol 引用（`"@cloud-bai/shared": "workspace:*"`），改了即時生效

**替代方案**：
- 分開兩個 repo：共用型別需發 npm package，迭代時多一個版本同步步驟
- 使用 turborepo/nx：專案規模不需要，增加學習成本

### 2. 後端框架：Fastify

**選擇**：使用 Fastify 作為後端 HTTP 框架。

**理由**：
- Plugin 架構提供明確的模組封裝與作用域隔離，引導思考架構設計
- 內建 TypeScript 支援，型別推導完整
- 內建 JSON Schema 驗證，請求/回應型別自動推導
- 效能優於 Express，非同步錯誤自動捕獲

**替代方案**：
- Express：生態最大但缺乏架構引導，TypeScript 支援後加
- Hono：最現代但與 socket.io 整合缺乏官方範例

### 3. WebSocket：socket.io 掛載於 Fastify

**選擇**：在 Fastify plugin 中初始化 socket.io server，掛載到 Fastify 的底層 HTTP server。

**理由**：
- group-worship 的 design.md 已決策使用 socket.io
- socket.io 內建 Room、心跳、自動重連、fallback 機制
- 透過 Fastify plugin 封裝，socket.io instance 以 `app.io` 形式提供給其他 plugin

**掛載方式**：
```ts
// server/src/plugins/socket.ts
import { Server } from 'socket.io'

async function socketPlugin(app) {
  const io = new Server(app.server, { cors: { origin: '*' } })
  app.decorate('io', io)
  app.addHook('onClose', () => io.close())
}
```

### 4. 資料庫：Drizzle ORM + Supabase PostgreSQL

**選擇**：使用 Drizzle ORM 操作 Supabase 提供的 PostgreSQL 資料庫。

**理由**：
- Drizzle 語法接近原生 SQL，學習 SQL 的同時享有完整型別安全
- Drizzle 內建 migration 工具（`drizzle-kit`），schema 變更可追蹤
- Supabase 提供免費 PostgreSQL 託管（500MB），適合 MVP
- 未來可無痛切換到任何 PostgreSQL 託管服務（Neon、自建等）

**連線方式**：透過 Supabase 提供的 connection string 連接，使用 `drizzle-orm/postgres-js` driver。

**替代方案**：
- Prisma：功能完整但把 SQL 藏起來，不利學習；自有 DSL 而非 TypeScript
- SQLite/Turso：更輕量但 Supabase 的 Auth 功能需要 PostgreSQL

### 5. 認證：Supabase Auth

**選擇**：使用 Supabase Auth 處理第三方登入，後端透過 `@supabase/supabase-js` 驗證 JWT token。

**理由**：
- 開箱即用的第三方登入（Google、LINE 等），不需自行實作 OAuth flow
- 前端使用 Supabase client SDK 處理登入流程，取得 JWT
- 後端 middleware 驗證 JWT，從中取得 user ID
- 與 Supabase PostgreSQL 共用同一個專案，Auth 資料天然與資料庫整合

**驗證流程**：
```
前端 → Supabase Auth（登入）→ 取得 JWT
前端 → 後端 API（帶 JWT）→ auth middleware 驗證 → 處理請求
前端 → socket.io（帶 JWT）→ 連線時驗證 → 建立即時連線
```

**替代方案**：
- 自建 Auth（better-auth、lucia）：完全自控但開發量大，OAuth flow 繁瑣
- Firebase Auth：功能類似但會綁定 Google 生態

### 6. 共用型別套件：@cloud-bai/shared

**選擇**：建立 `packages/shared/` 作為 workspace package，提供前後端共用的 TypeScript 型別定義。

**內容**：
- WebSocket 事件名稱與 payload 型別（對應 group-worship 的事件表）
- 資料模型型別（User、Ceremony、Room 等）
- 共用常數（房間上限、超時時間等）

**理由**：
- 前後端型別一致性由編譯器保證，不會出現欄位名稱不一致的 bug
- 改型別時兩邊同時報錯，不會漏改

## Risks / Trade-offs

### [Risk] Monorepo 增加初始設定複雜度
從單一 package 轉為 monorepo 需要調整 tsconfig、pnpm workspace、開發腳本等設定。
→ **Mitigation**：一次性成本，設定完成後開發流程反而更順暢。保持最簡設定，不引入 turborepo 等額外工具。

### [Risk] Supabase 免費額度限制
Supabase 免費方案有 500MB 資料庫、50,000 月活用戶、500MB 儲存空間限制。
→ **Mitigation**：MVP 階段綽綽有餘。Drizzle ORM 不綁定 Supabase，未來可切換到其他 PostgreSQL 託管。

### [Risk] 開發時需同時啟動前後端
開發體驗從一個 process 變成兩個。
→ **Mitigation**：root package.json 設定 `pnpm dev` 同時啟動兩個服務，開發者感知不到差異。

### [Risk] Fastify 與 Nuxt server/ 目錄衝突
Nuxt 4 本身有 `server/` 目錄（Nitro server routes）。新建的 Fastify 後端也叫 `server/`，可能造成混淆。
→ **Mitigation**：Nuxt 的 server routes 保留用於 SSR 和簡單 API proxy。Fastify 後端放在根目錄的 `server/` 資料夾，與 Nuxt 的 `server/` 目錄透過 pnpm workspace 區分（Nuxt 的在 app 內部）。在 workspace 中明確命名：Nuxt 為 `@cloud-bai/app`，Fastify 為 `@cloud-bai/server`。
