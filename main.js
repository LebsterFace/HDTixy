let currentExample = 0;

function nextExample() {
	if (currentExample === examples.length) return;
	examples[currentExample++].activate();
}

canvasElement.onclick = nextExample;

const urlCode = new URLSearchParams(window.location.search).get("code");
if (urlCode) {
    new Example("Code loaded from URL", urlCode).activate();
} else {
	nextExample();
}
