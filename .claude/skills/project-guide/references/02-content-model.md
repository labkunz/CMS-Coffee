# 02 — Contentful 內容模型設計

> 📌 前置條件：先讀完 `01-contentful-basics.md` 理解 Contentful 的基本概念

Day 1 在 Contentful 後台建立資料結構時，對照此文件操作。

---

## Content Type: `menuItem`（菜單品項）

| 欄位名稱 | 欄位類型 | 設定 | 說明 |
|----------|----------|------|------|
| name | Short Text | Required | 品項名稱（如「衣索比亞 耶加雪菲」） |
| slug | Short Text | Required, Unique | URL 識別碼（如 `ethiopia-yirgacheffe`） |
| description | Rich Text | - | 品項描述 |
| price | Integer | Required | 價格 |
| category | Short Text | Validation: 限定值 | 分類（見下方說明） |
| image | Media (single) | - | 品項圖片 |
| featured | Boolean | Default: false | 是否為精選品項（首頁用） |

### category 欄位的 Validation 設定

在 Contentful 後台建立 `category` 欄位時，到 Validation tab，勾選 **Accept only specified values**，輸入：

- `espresso`
- `drip`
- `tea`
- `dessert`

這樣前端篩選時可以確保分類值的一致性。

---

## Content Type: `homepage`（首頁設定）

| 欄位名稱 | 欄位類型 | 說明 |
|----------|----------|------|
| heroTitle | Short Text | Banner 主標題 |
| heroSubtitle | Short Text | Banner 副標題 |
| heroImage | Media (single) | Banner 背景圖 |

> 💡 這個 Content Type 只會有一筆 Entry，用來管理首頁的 Banner 內容。

---

## Content Type: `about`（關於我們）

| 欄位名稱 | 欄位類型 | 說明 |
|----------|----------|------|
| title | Short Text | 頁面標題 |
| content | Rich Text | 店家介紹內容 |
| storeImage | Media (single) | 店面照片 |

> 💡 同樣只會有一筆 Entry。Rich Text 欄位的渲染方式見 `06-rich-text.md`。
