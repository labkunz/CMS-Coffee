# 03 — API 對應表

> 📌 搭配 `02-content-model.md` 一起看，建完模型後用這份測試 API

---

## Base URL

所有請求的完整 base URL：

```
https://cdn.contentful.com/spaces/{SPACE_ID}/environments/master/entries
```

所有請求都需要帶 `access_token` 參數。

---

## Endpoint 對應

| 用途 | Endpoint | 使用頁面 |
|------|----------|----------|
| 取得所有品項 | `GET /entries?content_type=menuItem` | 菜單頁 |
| 取得精選品項 | `GET /entries?content_type=menuItem&fields.featured=true` | 首頁 |
| 依分類篩選 | `GET /entries?content_type=menuItem&fields.category=espresso` | 菜單頁篩選 |
| 依 slug 取得單一品項 | `GET /entries?content_type=menuItem&fields.slug=latte` | 詳情頁 |
| 取得首頁設定 | `GET /entries?content_type=homepage` | 首頁 |
| 取得關於我們 | `GET /entries?content_type=about` | 關於頁 |

---

## Day 1 快速測試方式

在瀏覽器直接貼以下 URL（替換 `{SPACE_ID}` 和 `{CDA_TOKEN}`）：

```
https://cdn.contentful.com/spaces/{SPACE_ID}/environments/master/entries?access_token={CDA_TOKEN}&content_type=menuItem
```

如果回傳 JSON 且 `items` 陣列裡有你建的品項資料，代表 API 串接沒問題。

### 常見測試失敗原因

- **回傳空 `items: []`**：Entry 沒有按 Publish
- **回傳 401**：Access Token 填錯或過期
- **回傳 404**：Space ID 填錯，或 content_type ID 拼錯（注意大小寫）
