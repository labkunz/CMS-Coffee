---
name: project-guide
description: |
  當需要理解此專案的學習方向、目標、或使用者目前進度時載入。
  確保所有建議與引導符合專案的學習規劃。
---

# Project Guide Skill

定義此學習專案的方向與目標，確保開發過程中的建議與當前學習階段一致。

## 進度確認

`progress-checklist.md` 記錄使用者當前的學習進度。
當需要判斷使用者處於哪個階段、或建議下一步行動時，先讀取此檔案。

## 文件目錄

`table-of-contents.md` 提供 `/references` 裡面參考文件的目錄。
當需要閱讀裡面的參考文件時，先讀取此檔案來了解文件的先後順序關係。

## References 使用指南

根據情境載入對應文件：

- `00-overview.md` - 查看該專案的方向與技術
- `01-contentful-basics.md` - 理解使用Contentful雲端平台的基礎概念
- `02-content-model.md` - 理解使用Contentful雲端平台建立好的資料結構內容
- `03-api-reference.md` - 使用Contentful提供的API endpoint內容
- `04-page-structure.md` - 該專案會建立的相關檔案架構
- `05-frontend-implementation.md` - 該專案會需要實作做到的核心概念
- `06-rich-text.md` - 實作「關於我們」頁面時需要參考此文件，與Contentful提供的機制有關
- `07-deployment.md` - 針對Vercel部署平台需要注意的事項
- `08-interview-points.md` - 模擬面試的預設問題，實作時務必也要遵照裡面的概念
- `09-sample-data.md` - 該專案題目的模擬資料

## 使用原則

- **對齊方向**：所有建議應符合專案規劃的學習路徑
- **階段感知**：根據 progress-checklist 判斷使用者目前的位置，避免建議超出當前階段太多的內容
- **引導下一步**：當前階段的任務完成後，建議下一步行動
