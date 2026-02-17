# 混用 npm 和 pnpm 導致 Vue 多重實例衝突

## 這是什麼、為什麼需要它

混用 `npm install` 和 `pnpm install` 會讓 `node_modules` 結構壞掉。
因為兩個套件管理器的存放方式完全不同：

- **npm**：扁平化結構，所有套件放在同層
- **pnpm**：symlink + content-addressable store，有獨立的子路徑

混用後同一個套件（像是 `vue`）會在不同路徑各存一份，導致 Vue 多重實例被載入，最終出現錯誤：

```
Cannot read properties of null (reading 'ce')
```

stack trace 中可以從路徑看出有兩個 Vue 實例：

```
node_modules/.pnpm/@vue+runtime-core@3.5.28/...  ← pnpm 子路徑
node_modules/@vue/runtime-core/...               ← 一般路徑
```

## 怎麼修

### 清除快取重裝（最直接）

```bash
rm -rf node_modules .nuxt .output
pnpm install
```

### 其他備用方向（若清除後仍有問題）

在 `nuxt.config.ts` 強制 Vue deduplication：

```ts
export default defineNuxtConfig({
  vite: {
    resolve: {
      dedupe: ['vue']
    }
  }
})
```

## 預防再次發生

### `package.json` 加上 `engines`

```json
"engines": {
  "npm": "please-use-pnpm",
  "yarn": "please-use-pnpm",
  "pnpm": ">=10"
}
```

誤用 `npm install` 時會看到明確錯誤提示：

```
npm error Unsupported engine: ...expected: "please-use-pnpm"
```

### `.npmrc` 讓 engine 設定真正生效

```
engine-strict=true
```

預設 `engines` 只是 warning，加上這行才會真的中止並報錯。
