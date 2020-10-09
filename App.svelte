<script>
  let article = `Hi this is Kalan! We finally built a mini-svelte!`;
  let text2 =
    "但是現在還有很多功能是沒有實作的，例如依賴追蹤、生命週期、if else 等等。";

  console.log("Run Time JavaScript~");

  setTimeout(() => (text2 = "It is not reactive currently..."), 2000);
</script>

<div>
  <article>{article}</article>
</div>

<p>Hello World {text2}</p>

<p aria-label="My Text">You can also add attribute</p>
<video src="https://xxx.xx" />
