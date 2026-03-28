---
description: 每次程式碼變更時，進行原子化 commit
globs: **/*
---

# Atomic Commits

每次完成一個獨立的邏輯變更後，立即建立一個原子化的 git commit：

- **一個 commit 只做一件事**：一個功能、一個修復、一個重構，不混合不同目的的變更
- **完成即 commit**：不要累積多個變更後才一次 commit
- **commit message 精準描述該次變更的目的**，使用中文撰寫
- 如果一個任務涉及多個步驟（例如：新增元件 → 加入路由 → 更新樣式），每個步驟各自獨立 commit
