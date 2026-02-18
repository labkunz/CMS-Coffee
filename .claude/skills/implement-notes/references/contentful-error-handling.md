# Contentful API 錯誤處理：在 Composable 層加 try/catch

## 這是什麼、為什麼需要它

`useAsyncData` 本身會自動捕捉 fetcher 拋出的錯誤，放進 `error` ref，所以頁面的 `v-else-if="error"` 在大部分情況下都能正常觸發。

但沒有在 composable 層加 try/catch，有幾個問題：

1. **直接呼叫 composable 時沒有保護** — 若有人在 event handler 等非 `useAsyncData` 的地方呼叫 `getMenuItems()`，錯誤會直接往外拋，沒有東西承接，變成 Unhandled Promise Rejection
2. **錯誤格式不統一** — `$fetch` 對 HTTP 錯誤和網路錯誤拋出的物件格式不同，頁面拿到的 `error` 結構不可預期
3. **無法做統一格式化或記錄** — 如果未來想顯示中文錯誤訊息、或做 server-side logging，現在的結構沒有插入點

---

## 一個被否定的方向：把 useAsyncData 包進 composable

當時有想過讓 composable 自己呼叫 `useAsyncData`，這樣頁面不可能繞過它，情境一就消失了。

但這個方向有根本問題：

```ts
// useMenuItems.ts 裡
function getMenuItemBySlug(slug: string) {
  return useAsyncData('menuItem', () => ...)  // key 固定！
}

// 從 /menu/latte 跳到 /menu/espresso → key 沒變 → Nuxt 不重新 fetch → 畫面不更新
```

動態路由需要動態 key（`menuItem-${slug}`），key 就必須從外面傳進來，composable 開始需要知道自己在哪個 route 被呼叫——**職責模糊了**。

結論是：composable 的責任是「如何取得資料」，state 的生命週期管理（useAsyncData）留在頁面。

---

## 怎麼做：在 fetchContentful 加 try/catch

修改位置：`useContentfulClient.ts` 的 `fetchContentful`，一個地方覆蓋所有 domain composable。

```ts
try {
  const data = await $fetch<ContentfulResponse<T>>(...)
  return data
}
catch (error: unknown) {
  // HTTP 錯誤（FetchError 帶有 statusCode）
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const fetchError = error as { statusCode: number }
    throw createError({
      statusCode: fetchError.statusCode,
      statusMessage: getErrorMessage(fetchError.statusCode)
    })
  }

  // 網路錯誤（無 statusCode，例如斷線、timeout）
  throw createError({
    statusCode: 503,
    statusMessage: '網路連線異常，請確認網路後重試'
  })
}
```

錯誤訊息對照表（放在 composable 外的純函式）：

```ts
function getErrorMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: '請求格式錯誤',
    401: 'API 認證失敗，請確認 Access Token',
    404: '找不到指定的資源',
    429: '請求頻率過高，請稍後再試',
    500: 'Contentful 伺服器錯誤',
    503: 'Contentful 服務暫時不可用'
  }
  return messages[statusCode] ?? `未知錯誤（${statusCode}）`
}
```

---

## 需要注意的地方

- **`error: unknown` 不是 `error: any`** — TypeScript 要求先用 `'statusCode' in error` 確認型別才能存取屬性，這樣比 `any` 更安全
- **`createError()` 是 Nuxt 內建** — 不需要 import，產生的錯誤物件格式和 `useAsyncData` 的 `error` ref 相容，頁面不需要改動
- **頁面不需要動** — `useAsyncData` 繼續負責捕捉，`v-else-if="error"` 邏輯不變；差別只在 `error` 物件現在有標準化的 `statusCode` 和 `statusMessage`
- **`getErrorMessage` 放在 export function 外面** — 它只給 `fetchContentful` 內部使用，不需要進 return，也不需要 export
