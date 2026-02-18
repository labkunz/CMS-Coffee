<script setup lang="ts">
import type { MenuItem, ContentfulResponse } from '~/types/contentful'

const props = defineProps<{
  item: MenuItem
  includes?: ContentfulResponse<unknown>['includes']
}>()

const { resolveAssetUrl, findAsset } = useContentful()

const imageUrl = computed(() => {
  const assetId = props.item.fields.image?.sys?.id
  if (!assetId) return ''
  const asset = findAsset(assetId, props.includes)
  return resolveAssetUrl(asset)
})

const categoryMap: Record<string, string> = {
  espresso: 'Espresso',
  drip: '手沖',
  tea: '茶飲',
  dessert: '甜點'
}

const categoryLabel = computed(() => categoryMap[props.item.fields.category] ?? props.item.fields.category)
</script>

<template>
  <NuxtLink
    :to="`/menu/${item.fields.slug}`"
    class="group block"
  >
    <UCard
      class="h-full overflow-hidden transition-shadow hover:shadow-lg"
      :ui="{ body: 'p-0' }"
    >
      <!-- 圖片 -->
      <div class="aspect-4/3 overflow-hidden bg-muted">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="item.fields.name"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        >
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-muted"
        >
          <UIcon
            name="i-lucide-image"
            class="w-10 h-10"
          />
        </div>
      </div>

      <!-- 內容 -->
      <div class="p-4 flex flex-col gap-2">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-semibold text-base leading-snug">
            {{ item.fields.name }}
          </h3>
          <UBadge
            :label="categoryLabel"
            color="primary"
            variant="subtle"
            size="sm"
            class="shrink-0"
          />
        </div>
        <p class="text-sm text-muted line-clamp-2">
          {{ item.fields.description }}
        </p>
        <p class="text-primary font-bold mt-auto">
          NT$ {{ item.fields.price }}
        </p>
      </div>
    </UCard>
  </NuxtLink>
</template>
