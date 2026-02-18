# Nuxt UI v4 UHeader Slot 配置

## 這是什麼、為什麼需要它

在 Nuxt UI v4 的 `UHeader` 裡，每個 slot 有明確分工，如果放錯 slot，內容就不會出現在預期的位置。

這次問題的情境：導覽列寫在 `#body` slot 裡，桌機 1440px 下 Header 中間完全空白——因為 `#body` 根本不是給桌機用的。

## Slot 分工對照

| Slot | 實際用途 |
|---|---|
| `#left` | 左側（Logo、品牌名稱）|
| default（直接放子元素）| **桌機**中間導覽列 |
| `#right` | 右側（按鈕、切換器）|
| `#body` | **行動版**展開選單的內容區域 |
| `#toggle` | 自訂漢堡按鈕 |

## 怎麼用

```vue
<UHeader>
  <!-- 左側 Logo -->
  <template #left>
    <NuxtLink to="/" class="text-xl font-bold tracking-tight text-primary">
      Brew &amp; Bean
    </NuxtLink>
  </template>

  <!-- 桌機中間導覽列：直接放在 UHeader 內（default slot） -->
  <UNavigationMenu :items="navLinks" />

  <!-- 右側按鈕 -->
  <template #right>
    <UColorModeButton />
  </template>

  <!-- 行動版展開選單：垂直排列 -->
  <template #body>
    <UNavigationMenu :items="navLinks" orientation="vertical" />
  </template>
</UHeader>
```

## 需要注意的地方

- **`#body` ≠ 桌機中間**：`#body` 是行動版漢堡選單打開後才出現的內容，放桌機導覽列在這裡，桌機永遠看不到
- **不需要手動 `hidden md:flex`**：`UHeader` 會自行處理桌機 / 行動版的顯示邏輯，不需要額外加 Tailwind 的 class 來控制
- **版本確認**：這個 slot 結構是 Nuxt UI **v4** 的設計，查舊版文件或 v2/v3 的範例會對不上
