# 09 — 假資料參考 & 圖片資源

> 📌 Day 1 在 Contentful 後台填資料時對照此文件

---

## 菜單品項（menuItem）

### Espresso 類

| 名稱 | slug | 價格 | Featured |
|------|------|------|----------|
| 經典濃縮 Espresso | classic-espresso | 80 | ✗ |
| 拿鐵 Latte | latte | 120 | ✓ |

### 手沖 Drip 類

| 名稱 | slug | 價格 | Featured |
|------|------|------|----------|
| 衣索比亞 耶加雪菲 | ethiopia-yirgacheffe | 180 | ✓ |
| 哥倫比亞 薇拉 | colombia-huila | 160 | ✗ |

### 茶飲 Tea 類

| 名稱 | slug | 價格 | Featured |
|------|------|------|----------|
| 鍋煮奶茶 | pot-brewed-milk-tea | 140 | ✓ |
| 冷泡茉莉綠茶 | cold-brew-jasmine-tea | 100 | ✗ |

### 甜點 Dessert 類

| 名稱 | slug | 價格 | Featured |
|------|------|------|----------|
| 巴斯克乳酪蛋糕 | basque-cheesecake | 150 | ✗ |
| 肉桂捲 | cinnamon-roll | 120 | ✗ |

> 💡 共 8 個品項，3 個標記為 Featured（首頁精選區塊會顯示這 3 個）

---

## 首頁設定（homepage）

| 欄位 | 內容 |
|------|------|
| heroTitle | 每一杯，都是一段旅程 |
| heroSubtitle | 嚴選世界各地精品咖啡豆，手工烘焙，為你沖煮最純粹的風味 |
| heroImage | （放一張咖啡廳風格的圖片） |

---

## 關於我們（about）

| 欄位 | 內容 |
|------|------|
| title | 關於 Drift Coffee |
| content | Rich Text：2-3 段店家故事（見下方參考文字） |
| storeImage | （放一張店面照片） |

### About Rich Text 參考內容

在 Contentful 的 Rich Text 編輯器裡，可以直接打以下內容：

**第一段（創立理念）**

Drift Coffee 創立於 2023 年，名字取自咖啡沖煮時水流緩緩流過濾杯的樣子。我們相信，一杯好咖啡不需要匆忙，值得你停下腳步，感受每一口的風味變化。

**第二段（咖啡豆來源）**

我們的咖啡豆來自衣索比亞、哥倫比亞、瓜地馬拉等精品產區，與當地小農直接合作，確保每一批豆子都能追溯到產地。所有豆子在店內自家烘焙，從淺焙的花果調到深焙的巧克力調，滿足不同味蕾的偏好。

**第三段（空間特色）**

店內空間以木質調和暖光為主，搭配大面落地窗引入自然光。無論是獨自工作、朋友聚會，或只是想找一個安靜的角落發呆，Drift Coffee 都歡迎你。

---

## 圖片資源建議

使用 [Unsplash](https://unsplash.com) 免費圖庫，下載時選 **Small 尺寸（640px 寬）** 即可。

### 搜尋關鍵字對照

| 用途 | Unsplash 搜尋關鍵字 |
|------|---------------------|
| 經典濃縮 | `espresso shot` |
| 拿鐵 | `latte art` |
| 衣索比亞 耶加雪菲 | `pour over coffee` |
| 哥倫比亞 薇拉 | `drip coffee` |
| 鍋煮奶茶 | `milk tea` |
| 冷泡茉莉綠茶 | `iced green tea` |
| 巴斯克乳酪蛋糕 | `basque cheesecake` |
| 肉桂捲 | `cinnamon roll` |
| Hero Banner | `coffee shop interior` 或 `coffee beans` |
| 店面照片 | `cafe interior` |

### ⚠️ 記得在 Contentful 上傳圖片後要按 Publish

圖片上傳到 Contentful 的 Media Library 後，需要：
1. 先 Publish 圖片 Asset
2. 再將圖片連結到對應的 Entry 欄位
3. 最後 Publish 該 Entry

三步都要做，否則前端 API 會拿不到圖片。
