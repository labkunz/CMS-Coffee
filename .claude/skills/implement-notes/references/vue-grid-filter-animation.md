# Vue Grid 分類篩選動畫

## 這是什麼、為什麼需要它

在做「點擊分類 → 切換卡片列表」這類功能時，想加上淡入淡出效果。
直覺上會用 Vue 的 `<TransitionGroup>`，但在 **CSS Grid** 裡會遇到一個閃爍問題。

---

## TransitionGroup 在 Grid 裡的問題

### 根本原因

`<TransitionGroup>` 的離場動畫期間，元素雖然在淡出，但**還沒從 DOM 移除**，所以還是佔著 Grid 的格子位置。

結果：其他卡片要等離場動畫結束、元素真正消失後，才能重新排版 → 這個時候畫面會**瞬間跳位**。

```
[卡片 A 淡出中] [卡片 B] [卡片 C]  ← A 還佔格子
          ↓ 動畫結束
[卡片 B] [卡片 C]                   ← B、C 瞬間移位（閃爍）
```

`.card-move` 補不了這個問題，因為它只處理「同框元素互換位置」，不處理「等待格子釋放」。

---

## 解法：整個容器一起淡出再淡入（方案 C）

不讓個別卡片有動畫，改成**讓整個 Grid 容器**淡出 → 資料在透明狀態下切換 → 再淡入。

### 關鍵設計：兩個 ref 分工

| ref | 職責 | 更新時機 |
|-----|------|---------|
| `activeCategory` | 控制按鈕高亮（UI 即時反應） | 點擊後**立即**更新 |
| `displayedCategory` | 控制實際顯示的卡片（資料） | 等淡出完成**後**才更新 |

為什麼要拆？
→ 讓使用者點按鈕時**立刻看到高亮回饋**，但卡片的切換延遲到畫面透明後才發生，視覺上感覺流暢又不突兀。

### 動畫流程

```
點擊分類按鈕
  → activeCategory 更新（按鈕立即高亮）
  → watch 觸發 → gridVisible = false（容器淡出 200ms）
  → await 200ms（畫面透明，資料安靜換好）
  → displayedCategory 更新（filteredItems 重新計算）
  → gridVisible = true（容器淡入）
```

### 實作程式碼

```vue
<script setup lang="ts">
const FADE_MS = 200

const activeCategory = ref<Category>('all')       // 按鈕 UI 用
const displayedCategory = ref<Category>('all')    // 資料顯示用
const gridVisible = ref(true)

watch(activeCategory, async (next) => {
  gridVisible.value = false
  await new Promise(resolve => setTimeout(resolve, FADE_MS))
  displayedCategory.value = next
  gridVisible.value = true
})

const filteredItems = computed(() => {
  if (displayedCategory.value === 'all') return allItems.value
  return allItems.value.filter(item => item.fields.category === displayedCategory.value)
})
</script>

<template>
  <!-- 品項列表 / 無資料 共用淡入淡出容器 -->
  <div
    v-else
    class="grid-container"
    :class="{ 'grid-invisible': !gridVisible }"
  >
    <div v-if="filteredItems.length" class="grid ...">
      <MenuCard v-for="item in filteredItems" :key="item.sys.id" ... />
    </div>
    <div v-else>此分類目前沒有品項。</div>
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
```

---

## 需要注意的地方

### 為什麼不用 TransitionGroup + `position: absolute`？

一般解法是在 `.leave-active` 加 `position: absolute`，讓離場元素脫離排版流。
但在 Grid 容器裡，`absolute` 的定位基準會跑掉，卡片會飛到奇怪位置，需要額外用 JS 記住每張卡片的座標，複雜度高。

### 無資料訊息也要包進容器

「此分類沒有品項」的訊息要和 Grid 包在**同一個外層 div** 裡，這樣切到空分類時也會有相同的淡入淡出效果，體驗一致。

### FADE_MS 要和 CSS transition duration 對齊

`setTimeout` 的等待時間（200ms）必須 ≥ CSS `transition` 的時間（`0.2s`），否則容器還沒完全透明就開始換資料，會看到短暫的「半透明跳位」。
