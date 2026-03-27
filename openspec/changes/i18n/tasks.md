# 任務清單：i18n

## 基礎架構建置

- [ ] 1. 安裝 vue-i18n 與 unplugin-vue-i18n 套件
- [ ] 2. 設定 unplugin-vue-i18n 至 Vite 設定檔，啟用編譯時期最佳化
- [ ] 3. 建立 `src/locales/` 目錄結構，依功能模組建立子目錄（common、worship、deities、offerings、festivals）
- [ ] 4. 建立 vue-i18n 實例初始化模組（`src/plugins/i18n.ts`），設定 fallback 語言為 zh-TW、啟用 missing handler 警告

## 語言偵測與切換

- [ ] 5. 實作語言偵測邏輯：localStorage 偏好 > navigator.language > fallback zh-TW
- [ ] 6. 實作語言切換函式，切換時更新 vue-i18n locale 並寫入 localStorage
- [ ] 7. 實作語言切換 UI 元件（下拉選單或按鈕組），放置於設定頁面或全域導覽列
- [ ] 8. 確保切換語言後介面立即更新，無需重新載入頁面

## 懶載入機制

- [ ] 9. 實作動態載入翻譯檔案的工具函式（`loadLocaleMessages`），使用 `import()` 動態匯入並呼叫 `mergeLocaleMessage`
- [ ] 10. 實作路由守衛，進入特定頁面時自動載入對應 namespace 的翻譯檔案
- [ ] 11. 實作語言切換時批次載入所有已造訪模組的新語言翻譯
- [ ] 12. 確保應用啟動時僅載入使用者語言的 common 模組

## 共用 UI 文案翻譯

- [ ] 13. 建立 common namespace 的四語翻譯檔案（導覽列、按鈕、通用提示、表單驗證訊息等）
- [ ] 14. 將現有頁面中的硬編碼文案替換為 `$t()` 呼叫

## 文化內容翻譯

- [ ] 15. 建立 deities namespace 的四語翻譯檔案（神明名稱、稱號、簡介）
- [ ] 16. 建立 offerings namespace 的四語翻譯檔案（供品名稱、分類名稱、描述；英文附帶中文原名）
- [ ] 17. 建立 festivals namespace 的四語翻譯檔案（節慶名稱、習俗說明、日期描述）
- [ ] 18. 建立 worship namespace 的四語翻譯檔案（儀式步驟名稱、金紙種類、祈禱提示等）

## 測試

- [ ] 19. 撰寫語言偵測邏輯的單元測試（涵蓋各 navigator.language 值與 localStorage 有無的組合）
- [ ] 20. 撰寫語言切換功能的元件測試（切換後文案立即更新、localStorage 正確寫入）
- [ ] 21. 撰寫懶載入機制的單元測試（確認僅載入所需模組、切換語言時正確載入）
- [ ] 22. 撰寫翻譯完整性檢查腳本（比對四語翻譯檔案的 key 是否一致，找出遺漏）
