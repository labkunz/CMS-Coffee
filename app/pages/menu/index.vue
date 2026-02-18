<script setup lang="ts">
useSeoMeta({
  title: 'Brew & Bean · 菜單',
  description: '探索 Brew & Bean 的完整菜單，包含 Espresso、手沖咖啡、茶飲與甜點。'
})

const { getMenuItems } = useMenuItems()

const { data: menuResponse, error, pending } = await useAsyncData(
  'menuItems',
  () => getMenuItems()
)

type Category = 'all' | 'espresso' | 'drip' | 'tea' | 'dessert'

const FADE_MS = 200

// activeCategory：按鈕 UI 立即反應（讓按鈕高亮不延遲）
const activeCategory = ref<Category>('all')
// displayedCategory：實際控制顯示哪些卡片（等淡出後才切換）
const displayedCategory = ref<Category>('all')
// gridVisible：控制容器的 opacity
const gridVisible = ref(true)

watch(activeCategory, async (next) => {
  // 1. 淡出
  gridVisible.value = false
  // 2. 等淡出動畫完成
  await new Promise(resolve => setTimeout(resolve, FADE_MS))
  // 3. 切換資料（此時畫面是透明的，不會看到跳位）
  displayedCategory.value = next
  // 4. 淡入
  gridVisible.value = true
})

const categories: { value: Category, label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'espresso', label: 'Espresso' },
  { value: 'drip', label: '手沖' },
  { value: 'tea', label: '茶飲' },
  { value: 'dessert', label: '甜點' }
]

const allItems = computed(() => menuResponse.value?.items ?? [])
const includes = computed(() => menuResponse.value?.includes)

const filteredItems = computed(() => {
  if (displayedCategory.value === 'all') return allItems.value
  return allItems.value.filter(item => item.fields.category === displayedCategory.value)
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <!-- 標題 -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold mb-2">
        菜單
      </h1>
      <p class="text-muted">
        精選豆源，每杯都是職人手作
      </p>
    </div>

    <!-- 分類篩選 -->
    <div class="flex flex-wrap justify-center gap-2 mb-10">
      <UButton
        v-for="cat in categories"
        :key="cat.value"
        :variant="activeCategory === cat.value ? 'solid' : 'outline'"
        :color="activeCategory === cat.value ? 'primary' : 'neutral'"
        size="sm"
        @click="activeCategory = cat.value"
      >
        {{ cat.label }}
      </UButton>
    </div>

    <!-- Loading -->
    <div
      v-if="pending"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <USkeleton
        v-for="i in 6"
        :key="i"
        class="h-72 rounded-xl"
      />
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
        無法載入菜單，請稍後再試。
      </p>
      <UButton
        variant="outline"
        @click="refreshNuxtData('menuItems')"
      >
        重新載入
      </UButton>
    </div>

    <!-- 品項列表 / 無資料（共用淡入淡出容器） -->
    <div
      v-else
      class="grid-container"
      :class="{ 'grid-invisible': !gridVisible }"
    >
      <!-- 品項列表 -->
      <div
        v-if="filteredItems.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <MenuCard
          v-for="item in filteredItems"
          :key="item.sys.id"
          :item="item"
          :includes="includes"
        />
      </div>

      <!-- 無資料 -->
      <div
        v-else
        class="text-center py-20 text-muted"
      >
        <UIcon
          name="i-lucide-coffee"
          class="w-10 h-10 mx-auto mb-3"
        />
        <p>此分類目前沒有品項。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  transition: opacity 0.2s ease;
}

.grid-invisible {
  opacity: 0;
}
</style>
