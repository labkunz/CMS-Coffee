# 06 — Contentful Rich Text 渲染

> 📌 Day 4 做「關於我們」頁面時參考此文件

---

## 為什麼需要特別處理？

Contentful 的 Rich Text **不是 HTML 字串**，而是一個結構化的 JSON 物件。你不能直接用 `v-html` 渲染，需要先轉換。

---

## 安裝官方渲染套件

```bash
npm install @contentful/rich-text-html-renderer
```

---

## 使用方式

```vue
<script setup lang="ts">
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

const { getEntries } = useContentful()
const { data: aboutData } = await getEntries('about')

const htmlContent = computed(() => {
  if (!aboutData.value?.items?.[0]?.fields?.content) return ''
  return documentToHtmlString(aboutData.value.items[0].fields.content)
})
</script>

<template>
  <div v-html="htmlContent" class="prose" />
</template>
```

> `class="prose"` 是 Tailwind CSS Typography 外掛提供的 class，會自動幫 HTML 內容加上好看的排版樣式。

---

## 進階：自定義渲染（選用）

如果你想客製化特定區塊的渲染方式（例如圖片、連結），可以傳入 `options`：

```ts
import { BLOCKS } from '@contentful/rich-text-types'

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const url = `https:${node.data.target.fields.file.url}`
      return `<img src="${url}" alt="" class="rounded-lg" />`
    },
  },
}

const htmlContent = computed(() => {
  if (!aboutData.value?.items?.[0]?.fields?.content) return ''
  return documentToHtmlString(aboutData.value.items[0].fields.content, options)
})
```

---

## 面試可以講的點

「Contentful 的 Rich Text 是結構化 JSON 而非 HTML，我用官方的 renderer 來轉換，也可以透過自定義 renderNode 來客製化特定區塊的渲染方式。」
