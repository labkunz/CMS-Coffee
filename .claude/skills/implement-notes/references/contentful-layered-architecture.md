# Contentful Composable 分層架構拆解

## 這是什麼、為什麼需要它

原本的 `useContentful.ts` 把三件不同性質的事情混在一起：

| 層次 | 內容 | 問題 |
|------|------|------|
| HTTP 傳輸層 | `fetchContentful` + config 設定 | |
| Pure utilities | `resolveAssetUrl`、`findAsset` | 純函式，不需要 Vue composable |
| Domain API 層 | `getMenuItems`、`getHomePage`… | 各自對應不同 content type |

最明顯的責任錯位是 `resolveAssetUrl` 和 `findAsset`：這兩個是純函式，沒有用到任何 Vue reactivity 或 `useRuntimeConfig`，卻被包在 composable 裡。

---

## 怎麼拆

### 分三層

```
utils/contentful.ts              ← 純函式，無 Vue 依賴
composables/useContentfulClient  ← HTTP 基礎層
composables/useMenuItems         ← domain：menu
composables/useHomePage          ← domain：首頁
composables/useAbout             ← domain：關於我們
```

### 依賴方向

domain composables 透過呼叫 base composable 取得 fetch 能力（不各自重複設定 config）：

```ts
// composables/useMenuItems.ts
export function useMenuItems() {
  const { fetchContentful } = useContentfulClient()  // ← 呼叫 base

  async function getMenuItems(params = {}) {
    return fetchContentful<MenuItem>('menuItem', params)
  }

  return { getMenuItems, getFeaturedItems, getMenuItemBySlug }
}
```

純函式放在 `utils/`，Nuxt 會自動 auto-import，不需要在任何地方手動 import：

```ts
// utils/contentful.ts
export function resolveAssetUrl(asset) { ... }
export function findAsset(assetId, includes) { ... }
```

### Pages 的寫法變化

```ts
// 舊：全部從一個 composable 解構
const { getMenuItemBySlug, resolveAssetUrl, findAsset } = useContentful()

// 新：各自呼叫對應的 composable；resolveAssetUrl / findAsset 直接用（auto-import）
const { getMenuItemBySlug } = useMenuItems()
```

---

## 需要注意的地方

- **Pure function 不需要進 composable**：composable 的目的是封裝 Vue 的響應式狀態；如果一個函式只做資料轉換、沒有 reactivity，放在 `utils/` 才是正確位置
- **Nuxt `utils/` 是 auto-import**：放進去的具名函式在 pages 和 components 都能直接使用，不需要 import 語法
- **Component 也要同步調整**：例如 `MenuCard.vue` 也用了 `useContentful()`，容易漏掉
- **時機判斷**：功能穩定後才回頭做架構優化，比一開始就過度設計來得務實；但純函式放錯層這種設計錯誤，不管規模大小都值得修
