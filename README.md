# tiny-svelte

[Svelte 教學系列文](https://ithelp.ithome.com.tw/users/20103565/ironman/3632)

## 將 HTML 轉換為 AST

[compile](https://kjj6198.github.io/tiny-svelte/site)

在頁面上輸入 HTML 語法，會將語法轉為 AST 形式，實作與 Svelte 略同，但省略了各種錯誤處理與錯誤提示，也沒有做太詳細的檢查。

可參考 [parser.js](https://github.com/kjj6198/tiny-svelte/blob/master/parser.js) 與 [index.js](https://github.com/kjj6198/tiny-svelte/blob/master/index.js) 查看實作細節。

**若要測試實際的 Svelte parser 行為，可以到 [AST Explorer](https://astexplorer.net/) 當中點選 HTML > svelte 即可。**

## 將 AST 轉為 JavaScript 程式碼

[generated](https://kjj6198.github.io/tiny-svelte/site/generated.html)

將 repo 當中的 [App.svelte](https://github.com/kjj6198/tiny-svelte/blob/master/App.svelte) 轉換為 JavaScript 程式碼，
實作並沒有考慮 reactive 以及像是 if else 等語法支援，這邊主要展示 Svelte 是怎麼轉換成 JavaScript 程式碼的。

