<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { fetchContentful, resolveAssetUrl, findAsset } = useContentful()

const { data: itemResponse, error, pending } = await useAsyncData(
  `menuItem-${slug}`,
  () => fetchContentful('menuItem', { 'fields.slug': slug, 'limit': '1' })
)

// slug 不存在時拋出 404
if (!pending.value && !itemResponse.value?.items?.length) {
  throw createError({ statusCode: 404, statusMessage: '找不到此品項' })
}

const item = computed(() => itemResponse.value?.items[0] ?? null)

const imageUrl = computed(() => {
  const assetId = item.value?.fields?.image?.sys?.id
  if (!assetId) return ''
  const asset = findAsset(assetId, itemResponse.value?.includes)
  return resolveAssetUrl(asset)
})

const categoryMap: Record<string, string> = {
  espresso: 'Espresso',
  drip: '手沖',
  tea: '茶飲',
  dessert: '甜點'
}

const categoryLabel = computed(() =>
  item.value ? (categoryMap[item.value.fields.category] ?? item.value.fields.category) : ''
)

// 動態 SEO
watchEffect(() => {
  if (item.value) {
    useSeoMeta({
      title: `${item.value.fields.name} · Brew & Bean`,
      description: item.value.fields.description
    })
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <!-- Loading -->
    <div
      v-if="pending"
      class="space-y-6"
    >
      <USkeleton class="h-8 w-48" />
      <USkeleton class="aspect-video w-full rounded-xl" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-3/4" />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-alert-circle"
        class="w-10 h-10 mx-auto mb-3 text-red-500"
      />
      <p class="text-muted mb-4">
        載入失敗，請稍後再試。
      </p>
      <UButton
        to="/menu"
        variant="outline"
      >
        返回菜單
      </UButton>
    </div>

    <!-- 品項詳情 -->
    <div v-else-if="item">
      <!-- 返回按鈕 -->
      <NuxtLink
        to="/menu"
        class="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6 transition-colors"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="w-4 h-4"
        />
        返回菜單
      </NuxtLink>

      <div class="grid md:grid-cols-2 gap-10 items-start">
        <!-- 圖片 -->
        <div class="aspect-square overflow-hidden rounded-xl bg-muted">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="item.fields.name"
            class="w-full h-full object-cover"
          >
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-image"
              class="w-16 h-16 text-muted"
            />
          </div>
        </div>

        <!-- 資訊 -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold">
              {{ item.fields.name }}
            </h1>
            <UBadge
              :label="categoryLabel"
              color="primary"
              variant="subtle"
            />
          </div>

          <p class="text-2xl font-bold text-primary">
            NT$ {{ item.fields.price }}
          </p>

          <USeparator />

          <p class="text-muted leading-relaxed">
            {{ item.fields.description }}
          </p>

          <div
            v-if="item.fields.featured"
            class="flex items-center gap-2 text-sm text-primary"
          >
            <UIcon
              name="i-lucide-star"
              class="w-4 h-4 fill-current"
            />
            本週精選品項
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
