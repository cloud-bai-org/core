## MODIFIED Requirements

### Requirement: 專案使用 Nuxt 4 作為基礎框架
系統 SHALL 使用 Nuxt 4 建立全端專案，採用 TypeScript 作為開發語言，使用 Vue 3 Composition API + `<script setup>` 語法。Nuxt 4 內建 file-based routing、auto-import、auto component registration，不需額外安裝 unplugin 系列插件。專案透過 pnpm workspace 管理，Nuxt 前端作為 `@cloud-bai/app` workspace package。

#### Scenario: 專案初始化完成
- **WHEN** 開發者執行專案初始化命令
- **THEN** 系統產生基於 Nuxt 4 的 TypeScript 專案結構，包含 `app/` 目錄

#### Scenario: 開發伺服器啟動
- **WHEN** 開發者執行 `pnpm run dev`
- **THEN** Nuxt 前端與 Fastify 後端同時啟動，各自在不同 port 運作並提供 HMR 熱更新功能
