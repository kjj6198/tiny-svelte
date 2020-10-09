let article = `Hi this is Kalan! We finally built a mini-svelte!`;
let text2 = "但是現在還有很多功能是沒有實作的，例如依賴追蹤、生命週期、if else 等等。";
function instance() {
	console.log("Run Time JavaScript~");
	setTimeout(() => text2 = "It is not reactive currently...", 2000);
}

function create_fragment() {
	let div1;
	let t1;
	let article1;
	let p1;
	let t2;
	let p2;
	let t3;
	let video1;
	let t4;

	return {
		create: () => {
			div1 = document.createElement("div");
			t1 = document.createTextNode("\n  ");
			article1 = document.createElement("article");
			p1 = document.createElement("p");
			t2 = document.createTextNode("Hello World ");
			p2 = document.createElement("p");
			t3 = document.createTextNode("You can also add attribute");
			video1 = document.createElement("video");
			t4 = document.createTextNode("\n");
		},
		mount: () => {
			append(div1, fragment);
			append(t1, div1);
			append(article1, div1);
			append(text(article), article1);
			append(p1, fragment);
			append(t2, p1);
			append(text(text2), p1);
			p2.setAttribute("aria-label", "My Text");
			append(p2, fragment);
			append(t3, p2);
			video1.setAttribute("src", "https://xxx.xx");
			append(video1, fragment);
			append(t4, fragment);
		}
	};
}