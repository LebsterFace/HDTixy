let currentExample = 0;

function nextExample() {
    if (currentExample === examples.length) return;
    examples[currentExample++].activate();
}

nextExample();
canvasElement.onclick = nextExample;