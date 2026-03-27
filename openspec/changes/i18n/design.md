# 設計文件：i18n

## 背景脈絡

本應用需支援繁體中文（zh-TW）、英文（en）、日文（ja）、韓文（ko）四種語言。除一般 UI 文案外，台灣民間信仰的文化內容（神明名稱、供品名稱、金紙種類、節慶說明等）亦需提供在地化翻譯。

本變更假設 project-setup 已完成，包含 Vue 3 + Vite 7 環境、shadcn-vue + Tailwind CSS 4 設計系統、Pinia 狀態管理、檔案式路由骨架等基礎設施皆已就緒。

## 目標

- 整合 vue-i18n 與 unplugin-vue-i18n，建立完整的多語系架構
- 支援瀏覽器語言自動偵測與使用者手動切換
- 翻譯檔案按功能模組（namespace）分割，方便維護與擴充
- 文化內容（神明、供品、金紙、節慶）提供四語翻譯
- 非預設語言採懶載入，減少初始載入大小

## 非目標

- 不處理 RTL（右到左）語言排版（四種目標語言皆為 LTR）
- 不實作使用者自訂翻譯或社群翻譯功能
- 不處理伺服器端渲染（SSR）的 i18n 問題
- 不實作語言相關的 URL 路由前綴（如 `/en/`、`/ja/`）

## 設計決策

### 決策 1：i18n 框架選擇

**選擇：vue-i18n + unplugin-vue-i18n**

- vue-i18n 是 Vue 生態系最成熟的 i18n 方案，與 Vue 3 Composition API 完整整合
- unplugin-vue-i18n 提供編譯時期最佳化，將翻譯訊息預編譯為 JavaScript 函式，避免執行時期的解析開銷
- 支援 SFC（Single File Component）內嵌 `<i18n>` 區塊與外部 JSON/YAML 翻譯檔案

**替代方案（未採用）**：
- 自行實作簡易 i18n：缺乏複數形式、日期格式化、訊息編譯等進階功能
- i18next + vue-i18next：生態系偏向 React，Vue 整合度不如 vue-i18n

### 決策 2：翻譯檔案組織結構

**選擇：按功能模組分割，每個模組一個目錄，每種語言一個檔案**

```
src/locales/
  common/
    zh-TW.json
    en.json
    ja.json
    ko.json
  worship/
    zh-TW.json
    en.json
    ja.json
    ko.json
  deities/
    zh-TW.json
    en.json
    ja.json
    ko.json
  offerings/
    zh-TW.json
    en.json
    ja.json
    ko.json
  festivals/
    zh-TW.json
    en.json
    ja.json
    ko.json
```

- 按功能模組分割可控制單一檔案大小，便於懶載入
- 每個模組以 namespace 為 key 前綴，避免 key 衝突
- `common/` 放置跨模組共用的翻譯（導覽列、按鈕、通用提示等）

**替代方案（未採用）**：
- 按語言分割（每種語言一個大檔案）：不利於懶載入，單檔案隨功能增加會過大
- SFC 內嵌 `<i18n>` 區塊：分散在各元件中，難以統一管理與交付翻譯

### 決策 3：語言偵測與偏好儲存

**選擇：navigator.language 偵測 + localStorage 儲存偏好**

- 首次造訪時讀取 `navigator.language`，若匹配 en/ja/ko 則自動切換，否則預設 zh-TW
- 使用者手動選擇後將偏好寫入 `localStorage`（key: `user-locale`）
- 後續造訪優先讀取 localStorage，其次 navigator.language，最後 fallback zh-TW
- 偵測優先順序：localStorage > navigator.language > zh-TW

**替代方案（未採用）**：
- Cookie 儲存：對純前端 PWA 無明顯優勢，且有 Cookie 大小限制
- 後端使用者設定：增加 API 呼叫，訪客無法使用

### 決策 4：懶載入策略

**選擇：初始僅載入使用者語言的 common 模組，其餘模組與語言動態載入**

- 應用啟動時根據偵測到的語言，載入該語言的 `common` 翻譯（導覽列等全域文案）
- 進入特定頁面時，透過路由守衛或元件 `onMounted` 動態載入對應模組的翻譯
- 切換語言時，動態載入新語言的所有已造訪模組翻譯
- 使用 `import()` 動態匯入，Vite 會自動 code split 為獨立 chunk

```typescript
async function loadLocaleMessages(locale: string, namespace: string) {
  const messages = await import(`@/locales/${namespace}/${locale}.json`)
  i18n.global.mergeLocaleMessage(locale, { [namespace]: messages.default })
}
```

### 決策 5：文化內容翻譯策略

**選擇：靜態資料內嵌多語欄位，翻譯檔案管理顯示文案**

- 神明、供品、金紙、節慶等資料的翻譯放在對應的 namespace 翻譯檔案中
- 資料模型使用 i18n key 作為名稱欄位，執行時透過 `$t()` 取得翻譯
- 英文供品名稱附帶中文原名的格式：翻譯檔案中直接包含，如 `"apple": "Apple (蘋果)"`

## 資料模型概要

- **翻譯檔案**：JSON 格式，按 namespace 分割，每種語言獨立檔案
- **語言偏好**：`localStorage` 中的 `user-locale` 欄位
- **已載入語言模組**：vue-i18n 實例內部管理，透過 `mergeLocaleMessage` 動態擴充

## 風險

| 風險 | 影響 | 緩解措施 |
|------|------|----------|
| 翻譯品質不一致 | 文化內容翻譯錯誤可能造成誤解或冒犯 | 邀請母語者審校，神明名稱優先參考官方翻譯 |
| 翻譯 key 遺漏 | 部分介面顯示原始 key 而非翻譯文案 | 開發階段啟用 vue-i18n 的 missing handler 警告，CI 檢查翻譯完整性 |
| 懶載入導致閃爍 | 語言包載入完成前短暫顯示 fallback 語言 | 在路由守衛中 await 載入完成後再渲染，搭配 loading 狀態 |
| 翻譯檔案維護成本高 | 四種語言 x 多個模組的翻譯檔案數量龐大 | 建立翻譯 key 命名規範，考慮未來引入翻譯管理平台 |
