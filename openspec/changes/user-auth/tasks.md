## Group 1：訪客模式

- [ ] 2.1.1 建立 `useAuthStore`（Pinia），定義驗證狀態結構（isLoggedIn、user、authProvider、guestId）
- [ ] 2.1.2 實作訪客身份初始化邏輯：應用啟動時若無登入 token，自動產生 guestId 並進入訪客模式
- [ ] 2.1.3 實作訪客紀錄本機儲存（localStorage/IndexedDB），包含拜拜紀錄與環保成效
- [ ] 2.1.4 實作訪客紀錄雲端上傳，身份標記為「訪客」並附帶 guestId
- [ ] 2.1.5 實作儀式完成後的登入提示 UI（「登入即可將紀錄綁定至你的帳號」）

## Group 2：Google OAuth 登入

- [ ] 2.2.1 整合 Google OAuth SDK，設定 OAuth client ID 與 redirect URI
- [ ] 2.2.2 實作「使用 Google 登入」按鈕與 OAuth 授權流程（導向授權頁、callback 處理）
- [ ] 2.2.3 實作 Google 登入成功後取得使用者資料（名稱、頭像、Email）並建立/更新帳號
- [ ] 2.2.4 將 Google auth token 存入 useAuthStore 並持久化

## Group 3：LINE Login 登入

- [ ] 2.3.1 整合 LINE Login SDK，設定 Channel ID 與 redirect URI
- [ ] 2.3.2 實作「使用 LINE 登入」按鈕與 LINE Login 授權流程（導向授權頁、callback 處理）
- [ ] 2.3.3 實作 LINE 登入成功後取得使用者資料（LINE 名稱、頭像）並建立/更新帳號
- [ ] 2.3.4 將 LINE auth token 存入 useAuthStore 並持久化

## Group 4：登入後資料同步與登出

- [ ] 2.4.1 實作登入後從伺服器載入使用者歷史資料（拜拜紀錄、環保成效、廟宇打卡）
- [ ] 2.4.2 實作訪客紀錄合併邏輯：登入時將本機訪客紀錄合併至雲端帳號，標記已同步
- [ ] 2.4.3 實作登出功能：清除本機登入狀態與 token，回到訪客模式
- [ ] 2.4.4 封裝 auth service 層，隔離 Google/LINE SDK 細節，統一對外介面
