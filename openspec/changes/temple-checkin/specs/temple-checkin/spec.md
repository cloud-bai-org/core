## ADDED Requirements

### Requirement: 掃描廟宇 QR Code 打卡
系統 SHALL 支援使用者在實體廟宇掃描 QR Code 進行打卡記錄。

#### Scenario: 掃描 QR Code
- **WHEN** 使用者點擊「掃描打卡」並對準廟宇 QR Code
- **THEN** 系統使用 html5-qrcode 解析 QR Code 內容，辨識廟宇 ID 並記錄打卡

#### Scenario: QR Code 辨識成功
- **WHEN** QR Code 成功辨識
- **THEN** 系統顯示該廟宇的基本資訊並完成打卡

#### Scenario: QR Code 辨識失敗
- **WHEN** QR Code 無法辨識
- **THEN** 系統顯示錯誤提示，建議手動搜尋

### Requirement: 手動搜尋廟宇打卡
系統 SHALL 提供手動搜尋功能。

#### Scenario: 搜尋廟宇
- **WHEN** 使用者輸入廟宇名稱
- **THEN** 系統從靜態 JSON 搜尋匹配結果

#### Scenario: 手動打卡
- **WHEN** 使用者選擇廟宇並點擊「打卡」
- **THEN** 系統記錄打卡紀錄

### Requirement: 選擇祈願目的
系統 SHALL 讓使用者選擇祈願目的。

#### Scenario: 瀏覽祈願類型
- **WHEN** 使用者打卡成功後
- **THEN** 系統顯示祈願目的列表（學業、事業、愛情、健康、財運、平安等）

#### Scenario: 選擇祈願目的
- **WHEN** 使用者選擇一個祈願目的
- **THEN** 系統記錄並根據廟宇神明產生推薦參拜路線

### Requirement: 參拜路線推薦與導覽
系統 SHALL 根據祈願目的與廟宇神明產生推薦參拜順序。

#### Scenario: 產生參拜路線
- **WHEN** 使用者選擇祈願目的後
- **THEN** 系統產生推薦的參拜順序

#### Scenario: 路線導覽
- **WHEN** 使用者開始跟隨參拜路線
- **THEN** 系統依序顯示各殿堂的參拜指引

### Requirement: 個人拜拜足跡地圖
系統 SHALL 為已登入使用者建立參拜足跡地圖。

#### Scenario: 查看足跡地圖
- **WHEN** 已登入使用者查看「我的足跡」
- **THEN** 系統以地圖顯示曾打卡過的廟宇位置

### Requirement: 參拜歷程統計與成就徽章
系統 SHALL 統計參拜歷程並頒發成就徽章。

#### Scenario: 參拜統計
- **WHEN** 已登入使用者查看個人統計
- **THEN** 系統顯示已參拜廟宇數量、祈願類型分佈

#### Scenario: 成就徽章
- **WHEN** 達成特定條件
- **THEN** 系統頒發成就徽章並顯示動畫

### Requirement: 廟宇資料使用自訂虛構名稱
系統 SHALL 使用自訂虛構的廟宇名稱。

#### Scenario: 廟宇資料內容
- **WHEN** 系統載入廟宇 JSON 資料
- **THEN** 所有廟宇名稱 MUST 為自訂虛構名稱
