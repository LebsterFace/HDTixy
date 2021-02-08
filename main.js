let currentExample = 0;

function nextExample() {
	if (currentExample === examples.length) return;
	examples[currentExample++].activate();
}

canvasElement.onclick = nextExample;

if (window.location.search) {
	const url = new URLSearchParams(window.location.search),
		urlCode = url.get("c"),
		urlMode = url.get("m"),
		urlCircles = url.get("r"),
		urlScale = url.get("z"),
		urlSpeed = url.get("s");

	new Example(introString, urlCode, {
		mode: urlMode,
		circles: urlCircles,
		scale: urlScale,
		speed: urlSpeed
	}).activate();
} else {
	nextExample();
}

function input(e) {
	commentElement.innerText = "// Press 'enter' to save in URL or\n" + "// click on the dots for more info";
	
	if (e.code === "Enter") {
		e.preventDefault();
		const saveURL = new URL(window.location);
		saveURL.searchParams.delete("c");
		saveURL.searchParams.delete("r");
		saveURL.searchParams.delete("z");
		saveURL.searchParams.delete("s");

		saveURL.searchParams.set("c", inputElement.value);
		if (!useTIXY.checked) saveURL.searchParams.set("m", useColors.checked ? "1" : "0");
		if (!useCircles.checked) saveURL.searchParams.set("r", "0");
		if (useScale.value !== "32") saveURL.searchParams.set("z", useScale.value);
		if (useSpeed.value !== "500") saveURL.searchParams.set("s", useSpeed.value);

		history.replaceState(null, inputElement.value, saveURL);
		return false;
	}

	setFunc();
}

inputElement.addEventListener("keyup", input);
inputElement.addEventListener("keydown", input);
