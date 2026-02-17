# 01 — Contentful 基礎概念（快速入門）

> 📌 前置條件：先讀完 `00-overview.md` 確認技術選型

## 核心名詞對照

| Contentful 術語 | 白話解釋 | 對應 Strapi |
|----------------|----------|-------------|
| Space | 你的工作空間（一個專案一個 Space） | 一個 Strapi 專案 |
| Content Model | 定義資料結構（有哪些欄位） | Content Type Builder |
| Content Type | 一種資料類型（如「菜單品項」） | Collection Type |
| Entry | 一筆資料（如「拿鐵」） | 一筆資料 |
| Asset | 圖片、檔案等媒體 | Media Library |
| Locale | 語系設定 | Internationalization |

---

## API 認證方式

Contentful 用 **Space ID** + **Access Token** 來驗證 API 請求：

1. 登入 Contentful → Settings → API keys
2. 建立一組 API key，會拿到：
   - **Space ID**：你的空間識別碼
   - **Content Delivery API (CDA) token**：用來讀取已發布的內容（前端用這個）
   - **Content Preview API token**：用來讀取草稿內容（預覽用，選用）

---

## API 基本格式

```
GET https://cdn.contentful.com/spaces/{SPACE_ID}/environments/master/entries
?access_token={CDA_TOKEN}
&content_type={CONTENT_TYPE_ID}
```

---

## 回傳結構範例

```json
{
  "items": [
    {
      "sys": {
        "id": "abc123",
        "type": "Entry",
        "contentType": { "sys": { "id": "menuItem" } }
      },
      "fields": {
        "name": "拿鐵 Latte",
        "slug": "latte",
        "price": 120,
        "category": "espresso",
        "description": "..."
      }
    }
  ],
  "includes": {
    "Asset": [
      {
        "sys": { "id": "img001" },
        "fields": {
          "file": { "url": "//images.ctfassets.net/xxx/yyy/image.jpg" }
        }
      }
    ]
  }
}
```

---

## ⚠️ 重要觀念：圖片在 `includes` 裡

Contentful 的圖片和關聯資料**不會直接塞在 Entry 裡**，而是放在 `includes` 區塊，需要透過 `sys.id` 去對應。

這是串接時最容易卡住的地方。處理方式見 `05-frontend-implementation.md` 的 `resolveAsset` 函式。

### 圖片 URL 注意事項

Contentful 回傳的圖片 URL 前面**沒有 `https:`**，格式如下：

```
//images.ctfassets.net/xxx/yyy/image.jpg
```

你需要自己補上 `https:`：

```ts
const imageUrl = `https:${asset.fields.file.url}`
```
