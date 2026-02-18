# ☕ 每日執行計畫 & 進度追蹤

## 標示說明

- 🤖 = **可以用 Claude Code 協作**（寫 code、產生檔案、設定配置）
- 🧑 = **需要你手動操作**（瀏覽器操作、帳號註冊、UI 介面操作）
- ✅ = 完成

---

## Day 1（2/17）：Contentful 設定 + Nuxt 4 專案建置

**目標**：CMS 有資料、前端專案跑得起來、能成功打 API

### Contentful 後台設定（🧑 手動）

- [x] ✅ 🧑 註冊 Contentful 免費帳號（contentful.com）
- [x] ✅ 🧑 建立 Space（命名為 `coffee-shop`）
- [x] ✅ 🧑 建立 Content Model：`menuItem`、`homePage`、`about`
- [x] ✅ 🧑 設定 `category` 欄位的 Validation（Accept only specified values：espresso / drip / tea / dessert）+ Appearance 改為 Dropdown
- [x] ✅ 🧑 從 Unsplash 下載品項圖片（10 張）
- [x] ✅ 🧑 新增假資料：8 個品項 + 首頁設定 + 關於我們（**全部已 Publish**）
- [x] ✅ 🧑 到 Settings → API keys 建立 API key，記下 Space ID 和 CDA token
- [x] ✅ 🧑 用瀏覽器直接測試 API（確認 JSON 回傳 total: 8，資料正常）

### Nuxt 4 專案建置（🤖 Claude Code）

- [x] ✅ 🧑 在終端機執行：`npx nuxi@latest init coffee-web`（需要你互動選擇選項）
- [x] ✅ 🤖 安裝 Nuxt UI v4：`npx nuxi@latest module add ui`
- [x] ✅ 🤖 設定 `nuxt.config.ts`（runtimeConfig、Contentful 環境變數）
- [x] ✅ 🤖 建立 `.env` 檔案，填入 Space ID 和 CDA token
- [x] ✅ 🤖 建立 `app/composables/useContentful.ts`（API 封裝）
- [x] ✅ 🤖 建立 `app/types/contentful.ts`（TypeScript 型別定義）
- [x] ✅ 🤖 寫一個測試頁面確認 API 串接成功
- [x] 🧑 在瀏覽器打開 localhost 確認資料有顯示

**預估時間**：3-4 小時  
**驗收標準**：瀏覽器打開 localhost，能看到從 Contentful 拉回來的資料

**可能踩坑**：
- Contentful 新增 Entry 後**必須按 Publish**，否則 CDA 拿不到
- 圖片 URL 回傳時前面沒有 `https:`，需要自己補上
- `includes` 裡的 Asset 需要用 `sys.id` 手動對應回 Entry

---

## Day 2（2/18）：首頁 + Layout

**目標**：首頁完整呈現，包含導覽列和頁尾

- [x] ✅ 🤖 建立 Layout（Navbar + Footer），使用 Nuxt UI 的 NavigationMenu 元件
- [x] ✅ 🤖 首頁 Hero Banner 區塊：從 `homepage` Content Type 取資料
- [x] ✅ 🤖 首頁精選品項區塊：篩選 `featured = true` 的品項，用 Nuxt UI Card 元件呈現
- [x] ✅ 🤖 品項卡片元件（`app/components/MenuCard.vue`）：圖片、名稱、價格、分類標籤
- [x] ✅ 🤖 處理圖片：用 `resolveAsset` 解析圖片 URL
- [ ] 🧑 在瀏覽器確認視覺效果，提供調整意見給 Claude Code

**預估時間**：4-5 小時  
**驗收標準**：首頁有 Banner + 3 張精選品項卡片，資料全部來自 Contentful

---

## Day 3（2/19）：菜單頁 + 詳情頁

**目標**：核心功能頁面全部完成

- [x] ✅ 🤖 菜單列表頁（`app/pages/menu/index.vue`）：顯示所有品項卡片
- [x] ✅ 🤖 分類篩選功能：用 Nuxt UI 的 Tabs 或 ButtonGroup 切換分類
- [x] ✅ 🤖 篩選邏輯：用 computed 前端過濾
- [x] ✅ 🤖 單品詳情頁（`app/pages/menu/[slug].vue`）：動態路由，展示完整品項資訊
- [x] ✅ 🤖 404 處理：slug 不存在時用 `createError` 拋出錯誤頁面
- [x] ✅ 🤖 Loading 狀態：用 `pending` 搭配 Nuxt UI 的 Skeleton 元件
- [x] ✅ 🤖 Error 狀態：API 失敗時的降級顯示
- [ ] 🧑 手動測試：切換分類、點進詳情頁、輸入不存在的 slug 確認 404

**預估時間**：5-6 小時  
**驗收標準**：菜單頁能篩選、點進詳情頁能看到完整資訊、錯誤情境有處理

---

## Day 4（2/20）：關於頁面 + SEO + 部署

**目標**：所有頁面完成，部署上線

### 關於頁面 + SEO（🤖 Claude Code）

- [x] ✅ 🤖 安裝 `@contentful/rich-text-html-renderer`
- [x] ✅ 🤖 關於我們頁面（`app/pages/about.vue`）：Rich Text 渲染 + 店面照片
- [x] ✅ 🤖 SEO 設定：用 `useHead` 或 `useSeoMeta` 設定每頁的 title / description

### 部署（🧑 手動 + 🤖 輔助）

- [x] ✅ 🤖 確認 `.gitignore` 包含 `.env`
- [x] ✅ 🤖 撰寫基本 `README.md`
- [ ] 🧑 推 code 到 GitHub
- [ ] 🧑 到 Vercel 連結 GitHub repo
- [ ] 🧑 在 Vercel 設定環境變數（CONTENTFUL_SPACE_ID、CONTENTFUL_ACCESS_TOKEN）
- [ ] 🧑 點 Deploy
- [ ] 🧑 測試線上版本所有頁面正常運作

**預估時間**：4-5 小時  
**驗收標準**：有一個公開的 URL，所有頁面和功能都正常

---

## Day 5（2/21）：收尾 + 緩衝

**目標**：品質打磨，確保可以放在履歷上

- [ ] 🤖 RWD 基本適配（手機版不要跑版）
- [ ] 🤖 整體視覺微調（間距、配色一致性）
- [ ] 🤖 README 補充完整：技術選型說明、架構說明、如何執行
- [ ] 🧑 最後測試：所有連結、圖片、API 都正常
- [ ] 🤖（如有餘力）補完 TypeScript 型別定義
- [ ] 🤖（如有餘力）加上 Nuxt Image 圖片最佳化

**預估時間**：2-3 小時  
**驗收標準**：網站可以直接附在履歷上，視覺和功能都沒問題

---

## Claude Code 協作總覽

以下是你可以直接請 Claude Code 幫你做的事情清單：

### 專案初始化
- `nuxt.config.ts` 完整設定
- `.env` 檔案模板
- 目錄結構建立

### 核心模組
- `useContentful.ts` composable（API 封裝 + 圖片解析）
- `contentful.ts` TypeScript 型別定義

### 頁面 & 元件
- Layout（Navbar + Footer）
- 首頁（Hero Banner + 精選品項）
- 菜單列表頁（品項卡片 + 分類篩選）
- 單品詳情頁（動態路由 + 404 處理）
- 關於我們頁面（Rich Text 渲染）
- MenuCard 共用元件
- Loading / Error 狀態元件

### 品質 & 部署
- SEO meta 設定
- RWD 調整
- README 撰寫
- `.gitignore` 設定
