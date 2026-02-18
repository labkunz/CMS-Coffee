# Contentful Composable 設計：wrapper 應回傳完整 response

## 這是什麼、為什麼需要它

`useContentful` 裡有封裝好的 wrapper 函式（`getAbout`、`getHomePage`、`getMenuItemBySlug`），但原本的設計是直接在 wrapper 內部取出 `items[0]` 後回傳：

```ts
// 原本的設計（有問題）
async function getAbout() {
  const data = await fetchContentful<About>('about', { limit: '1' })
  return data.items[0] ?? null  // includes 在這裡被丟掉了
}
```

這造成一個問題：**需要解析圖片的頁面必須用到 `response.includes`**，但 wrapper 把它丟掉了。

結果是 pages 被迫繞過 wrapper，直接呼叫底層的 `fetchContentful`——而且還要記得手動補型別參數，很容易漏掉：

```ts
// 被迫這樣寫，型別參數容易漏
fetchContentful<About>('about', { limit: '1' })
```

---

## 怎麼用

把 wrapper 改為回傳完整的 `ContentfulResponse<T>`，讓 `includes` 保留：

```ts
// 改後（正確設計）
async function getAbout() {
  return fetchContentful<About>('about', { limit: '1' })
  // → ContentfulResponse<About>，includes 完整保留
}
```

Pages 改為呼叫 wrapper，型別自動正確，也能拿到 `includes`：

```ts
// 改前（繞過 wrapper，手動帶型別）
const { fetchContentful, resolveAssetUrl, findAsset } = useContentful()
const { data: aboutResponse } = await useAsyncData(
  'about',
  () => fetchContentful<About>('about', { limit: '1' })
)

// 改後（直接用 wrapper，不需要手動型別）
const { getAbout, resolveAssetUrl, findAsset } = useContentful()
const { data: aboutResponse } = await useAsyncData(
  'about',
  () => getAbout()
)

// includes 仍然可以正常使用
const asset = findAsset(assetId, aboutResponse.value?.includes)
```

`items[0]` 的取用移到 page 的 computed 裡，這本來就是 page 自己的邏輯：

```ts
const about = computed(() => aboutResponse.value?.items[0] ?? null)
```

---

## 需要注意的地方

- 統一原則：**所有 wrapper 一律回傳完整 `ContentfulResponse<T>`**，不在 composable 層取出 `items[0]`
- 型別在 wrapper 裡就已鎖定，pages 呼叫 wrapper 時不需要再帶 `<T>`
- 這次調整的 wrapper：`getAbout`、`getHomePage`、`getMenuItemBySlug`（列表類的 `getMenuItems`、`getFeaturedItems` 原本就回傳完整 response，不需要動）
