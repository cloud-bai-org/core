## Why

應用需要彈性的使用者驗證機制，讓用戶零門檻體驗核心拜拜功能（訪客模式），同時提供 Google OAuth 與 LINE Login 兩種第三方登入方式，以便日後同步個人資料與跨裝置使用。

## What Changes

- 新增訪客模式，未登入即可使用拜拜儀式功能，紀錄保存至本機並上傳雲端（標記為訪客）
- 新增 Google OAuth 登入流程與帳號建立
- 新增 LINE Login 登入流程與帳號建立
- 新增登入後資料同步（拜拜紀錄、環保成效、廟宇打卡）
- 新增登出功能，清除本機登入狀態並回到訪客模式
- 儀式完成後提示訪客登入以綁定紀錄

## Capabilities

### New Capabilities
- `user-auth`: 三層驗證策略（訪客模式、Google OAuth、LINE Login），支援訪客免登入體驗、第三方帳號登入、登入後資料同步與登出

### Modified Capabilities
_None_

## Impact

- **前端狀態管理**：新增 `useAuthStore`（Pinia）管理登入狀態與使用者資訊
- **本機儲存**：使用 localStorage / IndexedDB 保存訪客模式紀錄
- **外部依賴**：Google OAuth SDK、LINE Login SDK
- **後端 API**：需配合使用者驗證端點（帳號建立、token 驗證、資料同步）
- **既有功能**：拜拜儀式流程需整合訪客/登入身份標記與儀式完成後的登入提示
