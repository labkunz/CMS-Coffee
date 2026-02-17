# 07 — 部署方案

> 📌 Day 4 部署時參考此文件

---

## 架構優勢：只需要部署前端

因為 Contentful 是雲端服務，CMS 不需要你部署。你只需要部署 Nuxt 4 前端到 Vercel。

對比 Strapi 方案需要同時部署前端和後端，這裡省掉了整個後端部署環節。

---

## Vercel 部署步驟

### 1. 準備工作

確認 `.gitignore` 包含：

```
.env
node_modules
.nuxt
.output
```

確認 `nuxt.config.ts` 的 runtimeConfig 是透過環境變數讀取的（不要寫死）。

### 2. 推到 GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/你的帳號/coffee-web.git
git push -u origin main
```

### 3. Vercel 設定

1. 到 [vercel.com](https://vercel.com) 登入（可用 GitHub 帳號）
2. 點 **New Project** → 選擇你的 GitHub repo
3. Vercel 會自動偵測 Nuxt 4 框架
4. 在 **Environment Variables** 區塊加入：
   - `CONTENTFUL_SPACE_ID` = 你的 Space ID
   - `CONTENTFUL_ACCESS_TOKEN` = 你的 CDA token
5. 點 **Deploy**

### 4. 驗證

部署完成後，Vercel 會給你一個 `xxx.vercel.app` 的 URL。逐一檢查：

- [ ] 首頁 Banner 圖片有顯示
- [ ] 精選品項卡片有出現
- [ ] 菜單頁能正常篩選
- [ ] 點進詳情頁資料正確
- [ ] 輸入不存在的 slug 會顯示 404
- [ ] 關於我們頁面 Rich Text 有正確渲染

---

## 常見部署問題

### 環境變數沒生效

**症狀**：線上版本 API 打不到、頁面空白  
**原因**：Vercel 的環境變數設定後需要重新部署才會生效  
**解法**：在 Vercel Dashboard → Settings → Environment Variables 確認值正確，然後 Redeploy

### SSR 模式相關

Nuxt 4 預設是 SSR 模式，Vercel 會自動處理 serverless function 的部署。如果遇到問題，確認 `nuxt.config.ts` 沒有設定 `ssr: false`。
