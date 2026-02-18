# pnpm 嚴格模式：不能直接用間接相依套件

## 這是什麼、為什麼需要它

pnpm 預設採用嚴格模式（strict mode），只有你在 `package.json` 裡**明確宣告**的套件，才能被 import 進來使用。

即使某個套件已經被其他相依拉進 `node_modules`（間接相依），pnpm 也**不允許**你直接 import 它——TypeScript 會報錯：

```
找不到模組 '@xxx/yyy' 或其對應的型別宣告。ts(2307)
```

這次碰到的情況：`@contentful/rich-text-types` 是 `@contentful/rich-text-html-renderer` 的相依套件，所以它的確存在於 `node_modules/.pnpm/` 裡，但因為沒有在 `package.json` 裡宣告，TypeScript 無法 resolve 它。

## 怎麼用

碰到這個錯誤，解法是把它**明確安裝為直接相依**。

如果只用來做型別宣告（`import type`），裝進 `devDependencies` 就夠了：

```bash
pnpm add -D @contentful/rich-text-types
```

安裝後 `package.json` 會新增：

```json
"devDependencies": {
  "@contentful/rich-text-types": "17.2.5"
}
```

這樣 TypeScript 就能正常找到模組，錯誤消失。

## 需要注意的地方

- 在 `node_modules/.pnpm/` 裡看得到，不代表你可以用——pnpm 嚴格模式就是要逼你明確宣告相依關係，避免「幽靈相依」（ghost dependencies）
- 如果套件只用於型別（`import type`），一律裝 `-D`（devDependencies），不要裝進 `dependencies`
- 確認版本號時，可以先看 `node_modules/.pnpm/` 目錄已有哪個版本，避免安裝到不相容的版本
