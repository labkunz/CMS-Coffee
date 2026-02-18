<script setup lang="ts">
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

useSeoMeta({
  title: 'Brew & Bean · 關於我們',
  description: '了解 Brew & Bean 的故事、理念，以及我們對咖啡的堅持。'
})

const { fetchContentful, resolveAssetUrl, findAsset } = useContentful()

const { data: aboutResponse, error, pending } = await useAsyncData(
  'about',
  () => fetchContentful('about', { limit: '1' })
)

const about = computed(() => aboutResponse.value?.items[0] ?? null)

const coverImageUrl = computed(() => {
  const assetId = about.value?.fields?.coverImage?.sys?.id
  if (!assetId) return ''
  const asset = findAsset(assetId, aboutResponse.value?.includes)
  return resolveAssetUrl(asset)
})

const descriptionHtml = computed(() => {
  if (!about.value?.fields?.description) return ''
  return documentToHtmlString(about.value.fields.description as Parameters<typeof documentToHtmlString>[0])
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <!-- Loading -->
    <div
      v-if="pending"
      class="space-y-6"
    >
      <USkeleton class="h-10 w-48" />
      <USkeleton class="aspect-video w-full rounded-xl" />
      <USkeleton
        v-for="i in 4"
        :key="i"
        class="h-4 w-full"
      />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="text-center py-20"
    >
      <UIcon name="i-lucide-alert-circle" class="w-10 h-10 mx-auto mb-3 text-red-500" />
      <p class="text-muted">
        無法載入頁面，請稍後再試。
      </p>
    </div>

    <!-- 內容 -->
    <div v-else-if="about">
      <h1 class="text-4xl font-bold mb-8">
        {{ about.fields.title }}
      </h1>

      <!-- 店面照片 -->
      <div
        v-if="coverImageUrl"
        class="aspect-video overflow-hidden rounded-xl mb-10 bg-muted"
      >
        <img
          :src="coverImageUrl"
          :alt="about.fields.title"
          class="w-full h-full object-cover"
        >
      </div>

      <!-- Rich Text 描述 -->
      <div
        class="prose prose-neutral dark:prose-invert max-w-none mb-10"
        v-html="descriptionHtml"
      />

      <!-- 聯絡資訊 -->
      <USeparator class="my-8" />

      <div class="grid sm:grid-cols-2 gap-6">
        <div
          v-if="about.fields.address"
          class="flex items-start gap-3"
        >
          <UIcon name="i-lucide-map-pin" class="w-5 h-5 mt-0.5 text-primary shrink-0" />
          <div>
            <p class="font-semibold mb-1">
              地址
            </p>
            <p class="text-muted whitespace-pre-line">
              {{ about.fields.address }}
            </p>
          </div>
        </div>

        <div
          v-if="about.fields.openingHours"
          class="flex items-start gap-3"
        >
          <UIcon name="i-lucide-clock" class="w-5 h-5 mt-0.5 text-primary shrink-0" />
          <div>
            <p class="font-semibold mb-1">
              營業時間
            </p>
            <p class="text-muted whitespace-pre-line">
              {{ about.fields.openingHours }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 無資料 fallback -->
    <div
      v-else
      class="text-center py-20 text-muted"
    >
      <UIcon name="i-lucide-coffee" class="w-10 h-10 mx-auto mb-3" />
      <p>關於我們的資訊尚未建立。</p>
    </div>
  </div>
</template>

<style scoped>
/* prose 樣式基本排版 */
:deep(.prose) {
  color: inherit;
  line-height: 1.8;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3) {
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

:deep(.prose p) {
  margin-bottom: 1em;
}

:deep(.prose ul),
:deep(.prose ol) {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

:deep(.prose li) {
  margin-bottom: 0.25em;
}

:deep(.prose a) {
  color: var(--color-primary-500);
  text-decoration: underline;
}
</style>
