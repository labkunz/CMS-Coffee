# Nuxt runtimeConfig：Server-only vs Public 的差異

## 這是什麼、為什麼需要它

Nuxt 的 `runtimeConfig` 可以放兩種變數：

- **私有（server-only）**：直接放在 `runtimeConfig` 根層，只有 server 端能讀取，不會傳到瀏覽器
- **公開（public）**：放在 `runtimeConfig.public` 裡，server 和 client 都能讀取

問題就發生在這：

> Server 端是把所有結果都先處理好後，放到頁面上。等於一開始已經先拿取好相關資料，並渲染出來，再拿去到頁面上呈現。
> 但「點擊跳轉」這部分是標準的 Client 端操作，當 client 去拿取 accessToken 時，因為被鎖定在 Server 端才能拿取，在 Client 端這個階段我是拿不到相關的變數的（undefined）。當然去呼叫 API 時就完全拿不到了。

## 症狀對照

| 情境 | 執行環境 | token | 結果 |
|------|----------|-------|------|
| 首次進入頁面 | Server | ✅ 有 | 正常顯示 |
| 重新整理 | Server | ✅ 有 | 正常顯示 |
| 點連結跳轉（client navigation） | Browser | ❌ undefined | 錯誤畫面 |

## 怎麼用

### 修改前（壞的）

```ts
// nuxt.config.ts
runtimeConfig: {
  contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN, // ← server-only
  public: {
    contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
    contentfulEnvironment: process.env.CONTENTFUL_ENVIRONMENT || 'master'
  }
}
```

```ts
// useContentful.ts
const accessToken = config.contentfulAccessToken // ← client 端拿到 undefined
```

### 修改後（正確）

```ts
// nuxt.config.ts
runtimeConfig: {
  public: {
    contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
    contentfulEnvironment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN // ← 移到 public
  }
}
```

```ts
// useContentful.ts
const accessToken = config.public.contentfulAccessToken // ← server/client 都能拿到
```

## 需要注意的地方

**為什麼 Contentful token 可以放 public？**

Contentful 的 Content Delivery API（CDA）token 是 **read-only** 的，本來就設計給前端使用。放到 `public` 不是繞過安全機制，而是正確的用法。

需要保密的是 **Content Management API（CMA）token**，那個才有寫入權限，絕對不能放 `public`。

**useAsyncData 的行為**

`useAsyncData` 在 SSR 時於 server 執行並將資料 hydrate 到前端。但當用戶透過 client-side navigation 進入「新頁面」時，該頁面的 `useAsyncData` 會在瀏覽器端重新執行——這是發生問題的關鍵時間點。
