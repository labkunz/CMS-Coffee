# 08 — 面試展示重點 & 話術整理

> 📌 專案完成後複習用

---

## API 串接（核心展示）

- 「我用 Nuxt 4 的 useFetch 串接 Contentful REST API，包含列表查詢、條件篩選、單筆資料取得」
- 「我封裝了 useContentful composable，統一管理 API 邏輯，元件只負責渲染」
- 「Contentful 的關聯資料（圖片）需要從 includes 區塊手動解析，我寫了 resolveAsset 來處理」

---

## 資料處理

- 「小資料量的篩選我用前端 computed 處理，避免不必要的 API 請求；但如果資料量大，我會改用 API 端的 query parameter 來篩選」
- 「我用 TypeScript 定義了 API 回傳的型別，確保資料結構變更時能提早發現」

---

## 錯誤處理

- 「每個 API 請求都有處理 loading、error、empty 三種狀態」
- 「動態路由頁面有 404 處理，找不到對應資料時拋出 createError」

---

## SSR 與 SEO

- 「使用 Nuxt 4 的 SSR 模式確保頁面內容可被搜尋引擎爬取」
- 「每頁動態設定 meta title 和 description，適合官網場景」

---

## 技術選型判斷

- 「選擇 Contentful 而非自架 Strapi，是因為這個場景需要快速交付，雲端 CMS 省去了後端基礎設施的維護成本」
- 「選擇 Nuxt UI v4 加速 UI 開發，讓我能把時間專注在 API 串接和資料處理邏輯上」

---

## 常見面試問題預備

### Q：你怎麼處理 API 串接的錯誤？

→ `useFetch` 回傳的 `error` 和 `pending` 狀態，搭配 UI 上的 loading skeleton 和 error fallback。動態路由頁面用 `createError` 拋出 404。

### Q：如果 CMS 的資料結構改了，前端怎麼應對？

→ 用 TypeScript 定義 API response 的型別，結構改變時 IDE 會提早報錯。另外 composable 封裝了 API 邏輯，修改時只需要改一個地方。

### Q：你怎麼優化內容頁面的效能？

→ Nuxt 4 的 SSR 確保首次載入速度。圖片部分可以用 Nuxt Image 做懶載入和自動壓縮。小資料量用前端過濾避免多餘的 API 請求。

### Q：為什麼用 Headless CMS 而不是傳統 CMS？

→ 前後端分離讓前端有更大的技術選擇自由度，API 驅動的架構也更容易擴展到多平台（App、其他網站）。對行銷團隊來說，後台操作體驗不變。

### Q：GraphQL 加分項（主動提及）

→ 「如果 CMS 的資料關聯比較複雜，我會傾向用 GraphQL 來精確取得需要的欄位，減少 over-fetching。Contentful 也支援 GraphQL API。」
