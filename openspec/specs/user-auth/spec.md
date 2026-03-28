## Requirements

### Requirement: 訪客模式免登入體驗
系統 SHALL 支援訪客模式，使用者無需登入即可使用基本拜拜功能。

#### Scenario: 訪客進入應用
- **WHEN** 未登入的使用者開啟應用
- **THEN** 系統允許直接使用拜拜儀式功能，不強制登入

#### Scenario: 訪客模式保存紀錄
- **WHEN** 訪客完成一場拜拜儀式
- **THEN** 系統將拜拜紀錄與環保成效保存至本機（localStorage/IndexedDB）並同步上傳至雲端，身份標記為「訪客」，方便開發者查詢 log 與分析使用行為

#### Scenario: 訪客紀錄與正式帳號資料區隔
- **WHEN** 訪客模式下產生的紀錄上傳至雲端
- **THEN** 系統明確區分訪客紀錄與第三方登入後的正式帳號資料，訪客紀錄以匿名身份儲存

#### Scenario: 儀式完成後提示登入
- **WHEN** 訪客完成拜拜儀式
- **THEN** 系統顯示提示「登入即可將紀錄綁定至你的帳號」

### Requirement: Google OAuth 登入
系統 SHALL 支援使用 Google 帳號登入。

#### Scenario: Google 登入流程
- **WHEN** 使用者點擊「使用 Google 登入」按鈕
- **THEN** 系統導向 Google OAuth 授權頁面，授權完成後自動返回應用並完成登入

#### Scenario: Google 登入成功
- **WHEN** Google OAuth 授權成功
- **THEN** 系統取得使用者的基本資料（名稱、頭像、Email）並建立使用者帳號

### Requirement: LINE Login 登入
系統 SHALL 支援使用 LINE 帳號登入。

#### Scenario: LINE 登入流程
- **WHEN** 使用者點擊「使用 LINE 登入」按鈕
- **THEN** 系統導向 LINE Login 授權頁面，授權完成後自動返回應用並完成登入

#### Scenario: LINE 登入成功
- **WHEN** LINE Login 授權成功
- **THEN** 系統取得使用者的基本資料（LINE 名稱、頭像）並建立使用者帳號

### Requirement: 登入後同步個人資料
系統 SHALL 在使用者登入後同步拜拜紀錄、環保成效、廟宇打卡等個人資料。

#### Scenario: 登入後載入歷史紀錄
- **WHEN** 使用者成功登入
- **THEN** 系統從伺服器載入該使用者的所有拜拜紀錄、環保成效統計與廟宇打卡資料

### Requirement: 使用者登出
系統 SHALL 提供登出功能。

#### Scenario: 執行登出
- **WHEN** 使用者點擊「登出」按鈕
- **THEN** 系統清除本機登入狀態，回到訪客模式
