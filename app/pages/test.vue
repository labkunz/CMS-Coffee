<script setup lang="ts">
const { getMenuItems } = useMenuItems()

const { data, pending, error } = await useAsyncData('test-menu', () =>
  getMenuItems({ limit: '3' })
)
</script>

<template>
  <div class="p-8 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">
      Contentful API 連線測試
    </h1>

    <!-- Loading -->
    <div
      v-if="pending"
      class="text-gray-500"
    >
      載入中...
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <p class="font-semibold text-red-700">
        API 連線失敗
      </p>
      <p class="text-sm text-red-600 mt-1">
        {{ error.message }}
      </p>
      <p class="text-xs text-gray-500 mt-2">
        請確認 .env 的 CONTENTFUL_SPACE_ID 和 CONTENTFUL_ACCESS_TOKEN 已替換為真實值
      </p>
    </div>

    <!-- 成功 -->
    <div v-else-if="data">
      <div class="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
        <p class="font-semibold text-green-700">
          API 連線成功！
        </p>
        <p class="text-sm text-green-600 mt-1">
          共取得 {{ data.total }} 筆品項，顯示前 {{ data.items.length }} 筆
        </p>
      </div>

      <div class="space-y-4">
        <div
          v-for="item in data.items"
          :key="item.sys.id"
          class="p-4 border rounded-lg"
        >
          <div class="flex gap-4 items-start">
            <img
              v-if="item.fields.image"
              :src="resolveAssetUrl(findAsset(item.fields.image.sys.id, data.includes))"
              :alt="item.fields.name"
              class="w-20 h-20 object-cover rounded"
            >
            <div>
              <h2 class="font-semibold">
                {{ item.fields.name }}
              </h2>
              <p class="text-sm text-gray-500">
                分類：{{ item.fields.category }}
              </p>
              <p class="text-sm font-medium text-amber-700">
                NT$ {{ item.fields.price }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                slug: {{ item.fields.slug }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
