## ADDED Requirements

### Requirement: 點香動畫
系統 SHALL 以視覺動畫模擬點香過程。

#### Scenario: 觸發點香
- **WHEN** 使用者點擊「點香」按鈕
- **THEN** 系統播放香被點燃的動畫，顯示火焰與逐漸生成的煙霧效果

### Requirement: 焚香煙霧效果
系統 SHALL 在焚香過程中呈現持續的煙霧視覺效果。

#### Scenario: 煙霧持續飄散
- **WHEN** 焚香動畫進行中
- **THEN** 香的頂端持續飄出煙霧

#### Scenario: 香的長度隨時間遞減
- **WHEN** 焚香計時進行中
- **THEN** 香的視覺長度隨著時間逐漸縮短

### Requirement: 焚香背景計時
系統 SHALL 支援焚香計時在背景持續運作。

#### Scenario: 開始計時後離開頁面
- **WHEN** 使用者在焚香計時啟動後切換至其他分頁或關閉瀏覽器
- **THEN** 計時透過 Service Worker 在背景持續運作

#### Scenario: 計時結束時間戳持久化
- **WHEN** 焚香計時開始
- **THEN** 系統將計時結束的時間戳記錄至 IndexedDB

### Requirement: 焚香完成推播通知
系統 SHALL 在焚香計時結束時透過瀏覽器推播通知提醒使用者。

#### Scenario: 背景通知
- **WHEN** 焚香計時結束且使用者不在應用頁面上
- **THEN** 系統透過 Web Notification API 發送通知「香已燃畢」

#### Scenario: 點擊通知返回應用
- **WHEN** 使用者點擊推播通知
- **THEN** 瀏覽器開啟應用並顯示焚香完成狀態

#### Scenario: 不支援通知的平台
- **WHEN** 瀏覽器不支援背景推播通知
- **THEN** 系統在使用者回到頁面時顯示 In-App 提示

### Requirement: 回到頁面自動更新狀態
系統 SHALL 在使用者回到頁面時自動檢查焚香狀態。

#### Scenario: 計時中途返回頁面
- **WHEN** 使用者在焚香計時進行中回到應用頁面
- **THEN** 系統根據 IndexedDB 時間戳計算剩餘時間，恢復動畫至正確進度

#### Scenario: 計時已結束後返回頁面
- **WHEN** 使用者在計時結束後回到頁面
- **THEN** 系統顯示焚香完成狀態
