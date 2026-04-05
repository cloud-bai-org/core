## ADDED Requirements

### Requirement: pnpm workspace monorepo 結構
系統 SHALL 使用 pnpm workspace 管理 monorepo，包含前端（Nuxt）、後端（Fastify）與共用型別三個 workspace package。

#### Scenario: workspace 設定正確
- **WHEN** 開發者在專案根目錄執行 `pnpm install`
- **THEN** pnpm 正確解析三個 workspace package（`@cloud-bai/app`、`@cloud-bai/server`、`@cloud-bai/shared`），並建立 workspace 內部連結

#### Scenario: workspace package 互相引用
- **WHEN** 後端或前端的 package.json 宣告依賴 `"@cloud-bai/shared": "workspace:*"`
- **THEN** pnpm 自動連結到 `packages/shared/`，import 時取得最新的型別定義

### Requirement: Fastify 後端服務骨架
系統 SHALL 提供基於 Fastify 的後端服務，採用 plugin 架構組織程式碼，使用 TypeScript 開發。

#### Scenario: 後端服務啟動
- **WHEN** 開發者在 `server/` 目錄執行啟動指令
- **THEN** Fastify 服務啟動於指定 port（預設 3001），控制台輸出啟動訊息

#### Scenario: 健康檢查端點可用
- **WHEN** 客戶端對 `GET /health` 發送請求
- **THEN** 服務回傳 HTTP 200 與 `{ status: "ok" }` JSON 回應

#### Scenario: Plugin 註冊順序正確
- **WHEN** Fastify 服務啟動時
- **THEN** Plugins 按照依賴順序註冊：database → auth → socket → routes

### Requirement: 共用型別套件
系統 SHALL 提供 `@cloud-bai/shared` workspace package，作為前後端共用 TypeScript 型別的唯一來源。

#### Scenario: 型別套件可被前端引用
- **WHEN** 前端程式碼 `import { ... } from '@cloud-bai/shared'`
- **THEN** TypeScript 編譯器正確解析型別，IDE 提供自動完成

#### Scenario: 型別套件可被後端引用
- **WHEN** 後端程式碼 `import { ... } from '@cloud-bai/shared'`
- **THEN** TypeScript 編譯器正確解析型別，IDE 提供自動完成

### Requirement: 統一開發腳本
系統 SHALL 提供根目錄的開發腳本，一個指令同時啟動前後端服務。

#### Scenario: 同時啟動前後端
- **WHEN** 開發者在根目錄執行 `pnpm dev`
- **THEN** Nuxt 前端與 Fastify 後端同時啟動，各自在不同 port 運作

#### Scenario: 單獨啟動後端
- **WHEN** 開發者執行 `pnpm dev:server`
- **THEN** 僅啟動 Fastify 後端服務
