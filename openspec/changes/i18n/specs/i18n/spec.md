## ADDED Requirements

### Requirement: 支援四種語言
系統 SHALL 支援繁體中文（zh-TW）、英文（en）、日文（ja）、韓文（ko）四種語言。

#### Scenario: 預設語言為繁體中文
- **WHEN** 使用者首次開啟應用且瀏覽器語言非 en/ja/ko
- **THEN** 系統預設使用繁體中文

#### Scenario: 自動偵測瀏覽器語言
- **WHEN** 使用者首次開啟應用且瀏覽器語言為 en、ja 或 ko
- **THEN** 系統自動切換至對應語言

### Requirement: 語言切換功能
系統 SHALL 提供語言切換功能。

#### Scenario: 切換語言
- **WHEN** 使用者在設定中選擇不同語言
- **THEN** 應用介面立即切換，無需重新載入頁面

#### Scenario: 語言偏好記憶
- **WHEN** 使用者手動選擇過語言偏好
- **THEN** 系統記住該偏好

### Requirement: UI 文案翻譯
系統 SHALL 使用 vue-i18n 管理所有 UI 文案。

#### Scenario: 按鈕與標題翻譯
- **WHEN** 介面語言切換為英文
- **THEN** 所有按鈕文字、頁面標題、提示訊息顯示為英文

#### Scenario: 翻譯檔案按 namespace 分割
- **WHEN** 開發者需要新增翻譯
- **THEN** 翻譯檔案按功能模組分割

### Requirement: 文化內容在地化
系統 SHALL 翻譯神明名稱、供品名稱、金紙種類等。

#### Scenario: 神明名稱翻譯
- **WHEN** 介面語言為日文
- **THEN** 神明名稱以日文漢字或片假名呈現

#### Scenario: 供品名稱翻譯
- **WHEN** 介面語言為英文
- **THEN** 供品名稱以英文呈現，附帶中文原名

#### Scenario: 節慶名稱與說明翻譯
- **WHEN** 介面語言為韓文
- **THEN** 節慶名稱與習俗說明以韓文呈現

### Requirement: 懶載入語言包
系統 SHALL 懶載入非預設語言的翻譯檔案。

#### Scenario: 初始載入僅包含預設語言
- **WHEN** 應用首次載入
- **THEN** 僅載入使用者語言包

#### Scenario: 切換語言時載入語言包
- **WHEN** 使用者切換至另一種語言
- **THEN** 系統動態載入該語言翻譯檔案
