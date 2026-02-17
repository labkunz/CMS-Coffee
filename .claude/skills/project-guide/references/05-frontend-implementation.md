# 05 — 前端核心實作

> 📌 前置條件：先讀完 `04-page-structure.md` 確認架構

這份文件是 Day 2-3 的實作核心參考。

---

## 1. Contentful API 封裝：`useContentful` composable

```ts
// app/composables/useContentful.ts

const config = useRuntimeConfig()

const BASE_URL = `https://cdn.contentful.com/spaces/${config.public.contentfulSpaceId}/environments/master`

export function useContentful() {

  // 取得多筆 entries
  const getEntries = (contentType: string, query: Record<string, any> = {}) => {
    return useFetch(`${BASE_URL}/entries`, {
      query: {
        access_token: config.public.contentfulAccessToken,
        content_type: contentType,
        ...query,
      },
    })
  }

  // 從 includes 中解析圖片 URL
  const resolveAsset = (assetLink: any, includes: any) => {
    if (!assetLink?.sys?.id || !includes?.Asset) return null
    const asset = includes.Asset.find((a: any) => a.sys.id === assetLink.sys.id)
    return asset ? `https:${asset.fields.file.url}` : null
  }

  return { getEntries, resolveAsset }
}
```

**面試關鍵**：這個 composable 封裝展示了你會把 API 邏輯抽離成可重用的模組，而不是在每個頁面重複寫。

---

## 2. 頁面串接範例：菜單列表

```vue
<!-- app/pages/menu/index.vue -->
<script setup lang="ts">
const { getEntries, resolveAsset } = useContentful()

const selectedCategory = ref('all')

const { data, pending, error } = await getEntries('menuItem')

// 前端篩選（資料量小時適用）
const filteredItems = computed(() => {
  if (!data.value?.items) return []
  if (selectedCategory.value === 'all') return data.value.items
  return data.value.items.filter(
    (item: any) => item.fields.category === selectedCategory.value
  )
})
</script>
```

**注意**：因為品項數量少（< 20 筆），分類篩選用前端 computed 過濾即可，不需要每次切換都重新打 API。但面試時要能說明「如果資料量大，會改用 API 端篩選」。

---

## 3. 動態路由：`/menu/[slug]`

```vue
<!-- app/pages/menu/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { getEntries, resolveAsset } = useContentful()

const { data, error } = await getEntries('menuItem', {
  'fields.slug': route.params.slug,
  limit: 1,
})

// 防禦性處理
if (error.value || !data.value?.items?.length) {
  throw createError({
    statusCode: 404,
    statusMessage: '找不到此品項',
  })
}

const item = computed(() => data.value.items[0])
const imageUrl = computed(() =>
  resolveAsset(item.value.fields.image, data.value.includes)
)
</script>
```

---

## 4. 環境變數設定

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID || '',
      contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
    },
  },
})
```

```env
# .env
CONTENTFUL_SPACE_ID=你的_space_id
CONTENTFUL_ACCESS_TOKEN=你的_cda_token
```

---

## 5. TypeScript 型別定義（加分項）

```ts
// app/types/contentful.ts

export interface MenuItem {
  name: string
  slug: string
  description: any // Rich Text 是複雜物件
  price: number
  category: 'espresso' | 'drip' | 'tea' | 'dessert'
  image: {
    sys: { id: string }
  }
  featured: boolean
}

export interface ContentfulResponse<T> {
  items: Array<{
    sys: { id: string }
    fields: T
  }>
  includes?: {
    Asset?: Array<{
      sys: { id: string }
      fields: {
        file: { url: string }
      }
    }>
  }
}
```

面試時可以說：「我用 TypeScript 定義了 API 回傳的型別，這樣當 CMS 資料結構改變時，前端可以透過型別檢查提早發現問題。」
