# .npmrc 是什麼

## 這是什麼、為什麼需要它

`.npmrc` 是提供給套件管理器的額外規範設定檔。

可以把它和 `package.json` 這樣區分：

| 檔案 | 負責的事 |
|------|---------|
| `package.json` | 專案的依賴、版本、scripts |
| `.npmrc` | 套件管理器本身的行為規範 |

## 各套件管理器的支援程度

| 套件管理器 | 支援 `.npmrc` |
|-----------|--------------|
| **npm** | 完整支援（原生格式） |
| **pnpm** | 完整支援（刻意相容 npm） |
| **Yarn 1** | 部分支援（基本設定能讀，進階設定不一定有效） |
| **Yarn 2+（Berry）** | 不支援，改用 `.yarnrc.yml` |
| **Bun** | 部分支援（主要是 registry 設定） |

**結論**：只有 npm 和 pnpm 可以完整直接套用，Yarn 1 只是剛好有些設定能共用。

## 常用設定範例

```
# 讓 package.json 的 engines 欄位強制生效（warning → error）
engine-strict=true

# 安裝時鎖定精確版本號，不加 ^ 或 ~
save-exact=true

# 指定套件下載來源
registry=https://registry.npmjs.org/

# pnpm 專屬：提升特定套件解決相容性問題
public-hoist-pattern[]=*vue*
```

## 讀取優先順序

越靠近專案越優先：

```
專案根目錄 .npmrc   ← 最優先
使用者目錄 ~/.npmrc
全域設定
```

## 本專案的用途

搭配 `package.json` 的 `engines` 欄位，防止誤用 npm 或 yarn：

```
# .npmrc
engine-strict=true
```

```json
// package.json
"engines": {
  "npm": "please-use-pnpm",
  "yarn": "please-use-pnpm",
  "pnpm": ">=10"
}
```

`engine-strict=true` 讓 engines 規則從「警告」升級為「報錯中止」。
