---
description: Git 開發規範：分支策略、commit 規範、合併流程
globs: **/*
---

# Git 開發規範

## 分支策略

- **`main` 為穩定分支**，不直接在上面開發或修 bug
- OpenSpec 規劃階段使用 `spec/<名稱>` 分支（proposal、design、specs、tasks 等 artifacts）
- 功能實作階段使用 `feature/<名稱>` 分支
- 修 bug / issue 使用 `hotfix/<名稱>` 分支
- 完成後在本地 merge 回 main（目前無 CI/CD，不強制 PR）

## Commit 規範（Conventional Commits）

- **一個 commit 只做一件事**：一個功能、一個修復、一個重構，不混合不同目的的變更
- **完成即 commit**：不要累積多個變更後才一次 commit
- 如果一個任務涉及多個步驟（例如：新增元件 → 加入路由 → 更新樣式），每個步驟各自獨立 commit
- commit message 遵循 Conventional Commits 格式：`<type>: <描述>`
  - `feat:` 新功能
  - `fix:` 修復 bug
  - `refactor:` 重構（不改變行為）
  - `chore:` 雜務（依賴、設定、CI 等）
  - `docs:` 文件
  - `style:` 格式調整（不影響邏輯）
  - `test:` 測試
- **描述使用中文**，精準表達該次變更的目的

## 合併規範

- 合併前確認分支已同步最新的 main
- 合併方式不限定，視情況選擇 squash merge、rebase 或一般 merge
- `spec/` 分支：所有 artifacts 完成後，詢問使用者是否要合回 main
- `feature/` 分支：實作完成且手動驗證通過後，詢問使用者是否要合回 main
- 不主動合併，一律先詢問使用者確認
