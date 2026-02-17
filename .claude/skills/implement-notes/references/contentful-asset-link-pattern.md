# Contentful Asset Link 模式

## 這是什麼、為什麼需要它

從 Contentful CDA 拿回來的 Entry，**圖片欄位不是直接嵌入的完整資料**，而是一個 Link 物件（只有 id）。
真正的圖片資料被放在 response 最外層的 `includes.Asset` 陣列裡，需要自己用 id 對應。

```json
// item.fields.image 實際長這樣（不是圖片本體）
{
  "sys": { "type": "Link", "linkType": "Asset", "id": "m6hdEJ6FgJM7xEK208D0U" }
}

// 真正的圖片資料在這裡
{
  "includes": {
    "Asset": [
      {
        "sys": { "id": "m6hdEJ6FgJM7xEK208D0U" },
        "fields": {
          "file": { "url": "//images.ctfassets.net/..." }
        }
      }
    ]
  }
}
```

Contentful 這樣設計是為了避免同一張圖片在多個 Entry 裡重複傳輸。

## 怎麼用

### 1. TypeScript 型別對應

Entry 裡的圖片欄位型別要用 `ContentfulLink`，不是 `ContentfulAsset`：

```typescript
// types/contentful.ts
export interface ContentfulLink {
  sys: {
    type: 'Link'
    linkType: 'Asset' | 'Entry'
    id: string
  }
}

export interface MenuItem {
  fields: {
    image: ContentfulLink  // ← Link，不是 Asset
  }
}
```

### 2. 用 id 查找真正的 Asset

```typescript
// composables/useContentful.ts
function findAsset(
  assetId: string,
  includes?: ContentfulResponse<unknown>['includes']
): ContentfulAsset | undefined {
  return includes?.Asset?.find(a => a.sys.id === assetId)
}
```

### 3. 補上 https: 前綴

Contentful 回傳的圖片 URL 開頭是 `//`，需要自己補 `https:`：

```typescript
function resolveAssetUrl(asset: ContentfulAsset | undefined): string {
  if (!asset?.fields?.file?.url) return ''
  const url = asset.fields.file.url
  return url.startsWith('//') ? `https:${url}` : url
}
```

### 4. 在 template 裡的完整用法

```vue
<!-- 先 findAsset 取得真正的 Asset，再 resolveAssetUrl 補上 https: -->
<img :src="resolveAssetUrl(findAsset(item.fields.image.sys.id, data.includes))" />
```

## 需要注意的地方

### 函式命名避開 Vue 內部保留名稱

Vue 3 runtime 內部有一個叫 `resolveAsset` 的函式（用來解析 component / directive）。
如果把自己的函式也取名為 `resolveAsset`，在 `<script setup>` 使用時 Vue template 編譯器可能會產生衝突，導致錯誤：

```
_ctx.resolveAsset is not a function
```

**解法**：改名為 `findAsset`，語義更清楚，也避掉命名衝突。

### `<script setup>` 解構要完整

在 template 裡用到的所有函式，都必須在 `<script setup>` 裡明確解構出來，否則 Vue 找不到：

```typescript
// ❌ 錯誤：template 用了 findAsset，但這裡沒解構
const { getMenuItems, resolveAssetUrl } = useContentful()

// ✅ 正確
const { getMenuItems, resolveAssetUrl, findAsset } = useContentful()
```
