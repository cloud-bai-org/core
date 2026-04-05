## Purpose

資料庫基礎設施——Drizzle ORM 設定、PostgreSQL 連線（Supabase）、migration 機制、基礎 schema。

## Requirements

### Requirement: Drizzle ORM 整合
系統 SHALL 使用 Drizzle ORM 作為資料庫操作層，連接 Supabase PostgreSQL，並透過 Fastify plugin 提供 `app.db` 實例。

#### Scenario: 資料庫連線成功
- **WHEN** Fastify 服務啟動且環境變數 `DATABASE_URL` 已設定
- **THEN** Drizzle ORM 成功建立與 PostgreSQL 的連線，database plugin 註冊完成

#### Scenario: 資料庫連線失敗
- **WHEN** Fastify 服務啟動但 `DATABASE_URL` 未設定或連線失敗
- **THEN** 服務啟動失敗並輸出明確的錯誤訊息

#### Scenario: 其他 plugin 可使用 db 實例
- **WHEN** 其他 Fastify plugin 需要存取資料庫
- **THEN** 可透過 `app.db` 取�� Drizzle 實例進行查詢操作

### Requirement: 資料庫 Migration 機制
系統 SHALL 使用 drizzle-kit 管理資料庫 schema 變更，提供 migration 產生與執行機制。

#### Scenario: 產生 migration 檔案
- **WHEN** 開發者修改 Drizzle schema 定義後執行 migration 產生指令
- **THEN** drizzle-kit 產生 SQL migration 檔案於 `server/drizzle/` 目錄

#### Scenario: 執行 migration
- **WHEN** 開發者執行 migration 指令
- **THEN** drizzle-kit 將 pending migration 套用至資料庫

### Requirement: 基礎 Schema 定義
系統 SHALL 提供基礎的 Drizzle schema 定義檔案結構，供後續功能擴充。

#### Scenario: Schema 檔案結構存在
- **WHEN** 開發者查看 `server/src/schema/` 目錄
- **THEN** 存在 `index.ts` 作為 schema 統一匯出入口
