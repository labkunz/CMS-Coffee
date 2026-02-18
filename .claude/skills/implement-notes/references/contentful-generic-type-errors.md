# Contentful 泛型型別錯誤：兩種常見的 TS 問題

## 這是什麼、為什麼需要它

在使用 `useContentful` 時，踩到了兩個 TypeScript 型別錯誤，雖然錯誤訊息不一樣，但都和「型別沒有被正確傳遞」有關。

---

## 問題一：呼叫泛型函式時忘記帶型別參數

`fetchContentful` 是一個泛型函式：

```ts
async function fetchContentful<T>(
  contentType: string,
  params: Record<string, string> = {}
): Promise<ContentfulResponse<T>>
```

如果呼叫時沒有帶 `<T>`，TypeScript 會把 `T` 推斷為 `{}`（空物件），導致整條型別鏈垮掉：

```
fetchContentful<{}>()
  → ContentfulResponse<{}>
  → items: {}[]
  → items[0]: {}
  → about.value?.fields  ← TS 報錯：{} 沒有屬性 fields
```

錯誤訊息：`類型 '{}' 沒有屬性 'fields'`

### 修法

呼叫時明確傳入對應的型別參數：

```ts
// 改前（TS 推斷為 {}）
fetchContentful('about', { limit: '1' })

// 改後
fetchContentful<About>('about', { limit: '1' })
```

---

## 問題二：`Document` 型別名稱衝突

在 `contentful.ts` 裡寫了：

```ts
export interface About {
  fields: {
    description: Document  // ← 這個是哪個 Document？
  }
}
```

因為沒有 import，TypeScript 自動抓了全域的 DOM `Document`（有 `getElementById` 那個），而不是 Contentful Rich Text 的 `Document`（有 `content`、`data`、`nodeType` 的那個）。

當 `documentToHtmlString()` 收到 DOM `Document` 時，就報：

> 類型 `Document` 在類型 `Document` 中缺少下列屬性：`content`、`data`

### 修法

在 `contentful.ts` 明確 import Contentful 的 `Document`：

```ts
import type { Document } from '@contentful/rich-text-types'
```

這樣 `About.fields.description` 就指向正確的 Rich Text `Document`，`as` 強制轉型也不再需要。

---

## 需要注意的地方

- 泛型函式在 TypeScript 無法推斷 `T` 時，**不會報錯**，而是靜默回退為 `{}`，很容易漏掉
- `Document` 是個常見的全域型別名稱，只要用到 Contentful Rich Text，都要明確 import，避免被 DOM 型別蓋掉
