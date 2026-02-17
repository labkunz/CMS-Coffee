# ☕ 咖啡廳品牌官網 — 專案文件目錄

## 文件結構

以下文件依照**建議閱讀順序**排列。標示 `→ 前置` 的代表需要先完成才能進入下一份。

| # | 文件 | 內容 | 備註 |
|---|------|------|------|
| 1 | [00-overview.md](./00-overview.md) | 專案概述、技術選型、選型理由 | → 前置：開工前先讀這份確認方向 |
| 2 | [01-contentful-basics.md](./01-contentful-basics.md) | Contentful 核心概念、API 認證、回傳格式 | → 前置：需先理解 Contentful 才能設計內容模型 |
| 3 | [02-content-model.md](./02-content-model.md) | 內容模型設計（menuItem / homepage / about） | → 前置：Day 1 在 Contentful 後台建資料結構時對照用 |
| 4 | [03-api-reference.md](./03-api-reference.md) | API endpoint 對應表 | 可與 02 同步參考，建完模型後測試 API 用 |
| 5 | [04-page-structure.md](./04-page-structure.md) | 頁面結構、路由規劃、目錄結構 | → 前置：開始寫 code 前先確認架構 |
| 6 | [05-frontend-implementation.md](./05-frontend-implementation.md) | 前端核心實作（composable、頁面串接、環境變數、TypeScript） | 實作主體，Day 2-3 的核心參考 |
| 7 | [06-rich-text.md](./06-rich-text.md) | Contentful Rich Text 渲染方式 | Day 4 做「關於我們」頁面時參考 |
| 8 | [07-deployment.md](./07-deployment.md) | 部署方案（Vercel） | Day 4 部署時參考 |
| 9 | [08-interview-points.md](./08-interview-points.md) | 面試展示重點 & 話術整理 | 專案完成後複習用 |
| 10 | [09-sample-data.md](./09-sample-data.md) | 假資料參考 & 圖片資源建議 | Day 1 填資料時對照用 |

---

## 獨立文件

| 文件 | 內容 |
|------|------|
| [progress-checklist.md](./progress-checklist.md) | 每日執行計畫 + Claude Code 協作標示 |

---

## 快速導航：依工作天

| 天數 | 主要參考文件 |
|------|-------------|
| Day 1 | `01-contentful-basics` → `02-content-model` → `09-sample-data` → `03-api-reference` → `04-page-structure` → `05-frontend-implementation`（composable 部分） |
| Day 2 | `05-frontend-implementation` → `04-page-structure` |
| Day 3 | `05-frontend-implementation` → `03-api-reference` |
| Day 4 | `06-rich-text` → `07-deployment` |
| Day 5 | `08-interview-points` |
