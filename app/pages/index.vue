<script setup lang="ts">
import type { HomePage } from '~/types/contentful'

useSeoMeta({
  title: 'Brew & Bean · 首頁',
  description: '精選豆源、手沖咖啡、甜點，歡迎來到 Brew & Bean 咖啡廳。'
})

const { fetchContentful, getFeaturedItems, resolveAssetUrl, findAsset } = useContentful()

// 首頁資料（用完整 response 才能拿到 includes.Asset 解析 heroImage）
const { data: homeResponse, error: homeError } = await useAsyncData(
  'homePage',
  () => fetchContentful<HomePage>('homePage', { limit: '1' })
)

// 精選品項
const { data: featuredData, error: featuredError } = await useAsyncData(
  'featuredItems',
  () => getFeaturedItems()
)

const homePage = computed(() => homeResponse.value?.items[0] ?? null)

const heroImageUrl = computed(() => {
  const link = homePage.value?.fields?.heroImage
  if (!link) return ''
  const assetId = link?.sys?.id
  const asset = findAsset(assetId, homeResponse.value?.includes)
  return resolveAssetUrl(asset)
})

const featuredItems = computed(() => featuredData.value?.items ?? [])
const featuredIncludes = computed(() => featuredData.value?.includes)
</script>

<template>
  <div>
    <!-- Hero Banner -->
    <section
      v-if="!homeError && homePage"
      class="relative flex items-center justify-center min-h-[60vh] overflow-hidden bg-muted"
    >
      <!-- 背景圖 -->
      <div
        v-if="heroImageUrl"
        class="absolute inset-0"
      >
        <img
          :src="heroImageUrl"
          :alt="homePage.fields.title"
          class="w-full h-full object-cover opacity-40"
        >
        <div class="absolute inset-0 bg-linear-to-b from-black/10 to-black/40" />
      </div>

      <!-- 文字內容 -->
      <div class="relative z-10 text-center px-4 py-20 max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          {{ homePage.fields.title }}
        </h1>
        <p class="text-lg md:text-xl text-muted mb-8">
          {{ homePage.fields.subtitle }}
        </p>
        <UButton
          :to="homePage.fields.heroButtonText ? '/menu' : '/menu'"
          size="xl"
          icon="i-lucide-arrow-right"
          trailing
        >
          {{ homePage.fields.heroButtonText || '查看菜單' }}
        </UButton>
      </div>
    </section>

    <!-- Hero 錯誤或無資料時的 fallback -->
    <section
      v-else-if="homeError"
      class="flex items-center justify-center min-h-[60vh] bg-muted"
    >
      <div class="text-center px-4 py-20">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          Brew &amp; Bean
        </h1>
        <p class="text-lg text-muted mb-8">
          精選豆源，用心沖出每一杯好咖啡
        </p>
        <UButton
          to="/menu"
          size="xl"
          trailing-icon="i-lucide-arrow-right"
        >
          查看菜單
        </UButton>
      </div>
    </section>

    <!-- Hero Loading -->
    <section
      v-else
      class="flex items-center justify-center min-h-[60vh] bg-muted"
    >
      <div class="text-center px-4 py-20 space-y-4 w-full max-w-xl mx-auto">
        <USkeleton class="h-16 w-2/3 mx-auto" />
        <USkeleton class="h-6 w-1/2 mx-auto" />
        <USkeleton class="h-12 w-40 mx-auto rounded-lg" />
      </div>
    </section>

    <!-- 精選品項 -->
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold mb-2">
            精選品項
          </h2>
          <p class="text-muted">
            本週主推，不容錯過
          </p>
        </div>

        <!-- Loading -->
        <div
          v-if="!featuredData && !featuredError"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <USkeleton
            v-for="i in 3"
            :key="i"
            class="h-72 rounded-xl"
          />
        </div>

        <!-- Error -->
        <div
          v-else-if="featuredError"
          class="text-center py-12 text-muted"
        >
          <UIcon
            name="i-lucide-alert-circle"
            class="w-8 h-8 mx-auto mb-2"
          />
          <p>無法載入精選品項，請稍後再試。</p>
        </div>

        <!-- 品項列表 -->
        <div
          v-else-if="featuredItems.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <MenuCard
            v-for="item in featuredItems"
            :key="item.sys.id"
            :item="item"
            :includes="featuredIncludes"
          />
        </div>

        <!-- 無資料 -->
        <div
          v-else
          class="text-center py-12 text-muted"
        >
          目前沒有精選品項。
        </div>

        <!-- 查看全部按鈕 -->
        <div class="text-center mt-10">
          <UButton
            to="/menu"
            variant="outline"
            size="lg"
            trailing-icon="i-lucide-arrow-right"
          >
            查看完整菜單
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>
