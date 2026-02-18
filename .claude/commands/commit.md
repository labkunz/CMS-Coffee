# Git Commit Command

檢查目前的變更並執行 git commit。

## 步驟

1. 執行 `git status` 和 `git diff --stat` 確認變更範圍
2. 根據變更內容，判斷是否需要拆分成多個 commit
3. 使用 `git add` stage 相關檔案
4. 撰寫符合 Conventional Commits 格式的 commit message
5. 執行 `git commit`

## Commit Message 格式

<type>(<scope>): <簡短描述>

Type：feat / fix / refactor / docs / style / test / chore

## 原則

- 一個 commit 只包含一個邏輯變更
- 描述要具體，說明「做了什麼」而非「改了哪個檔案」