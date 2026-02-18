# Brew & Bean — 咖啡廳品牌官網

咖啡廳品牌官網，以 **Nuxt 4** 為框架，串接 **Contentful** Headless CMS 管理內容，並部署於 Vercel。

---

## 技術選型

| 技術 | 說明 |
|------|------|
| [Nuxt 4](https://nuxt.com/) | Vue 全端框架，支援 SSR / SSG |
| [Nuxt UI v4](https://ui.nuxt.com/) | 基於 Tailwind CSS v4 的 UI 元件庫 |
| [Contentful CDA](https://www.contentful.com/) | Headless CMS，管理菜單、首頁、關於我們內容 |
| [TypeScript](https://www.typescriptlang.org/) | 全程型別安全 |
| [Vercel](https://vercel.com/) | 靜態 + SSR 部署平台 |
| [pnpm](https://pnpm.io/) | 套件管理工具 |

---

## 功能頁面

- **首頁** (`/`)：Hero Banner + 精選品項，資料來自 Contentful `homePage` Content Type
- **菜單** (`/menu`)：所有品項列表，支援分類篩選（espresso / drip / tea / dessert）
- **單品詳情** (`/menu/[slug]`)：動態路由，slug 不存在自動 404
- **關於我們** (`/about`)：Rich Text 描述、店面照片、地址、營業時間

---

## 本地執行

### 1. 安裝依賴

```bash
pnpm install
```

### 2. 設定環境變數

複製範例檔並填入 Contentful 的 Space ID 與 CDA Access Token：

```bash
cp .env.example .env
```

`.env` 內容：

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_cda_access_token
CONTENTFUL_ENVIRONMENT=master
```

> 到 Contentful → Settings → API keys 取得這些值。

### 3. 啟動開發伺服器

```bash
pnpm dev
```

開啟 [http://localhost:3000](http://localhost:3000)

---

## 架構說明

```
app/
├── composables/
│   └── useContentful.ts    # Contentful API 封裝（fetch + 圖片解析）
├── types/
│   └── contentful.ts       # Content Type TypeScript 型別定義
├── components/
│   └── MenuCard.vue        # 品項卡片共用元件
└── pages/
    ├── index.vue           # 首頁
    ├── about.vue           # 關於我們
    └── menu/
        ├── index.vue       # 菜單列表
        └── [slug].vue      # 單品詳情頁
```

### Contentful Content Types

| Content Type | 主要欄位 |
|-------------|---------|
| `menuItem` | name, slug, description, price, category, image, featured |
| `homePage` | title, subtitle, heroImage, heroButtonText |
| `about` | title, description (Rich Text), coverImage, address, openingHours |

---

## 部署到 Vercel

1. 推 code 到 GitHub
2. 在 Vercel 匯入 GitHub repo
3. 設定環境變數：`CONTENTFUL_SPACE_ID`、`CONTENTFUL_ACCESS_TOKEN`
4. 點擊 Deploy

---

## 本地 Build & Preview

```bash
pnpm build
pnpm preview
```
