let currentExample = 0;

const nextExample = () => {
	if (currentExample === examples.length) return;
	examples[currentExample++].activate();
};

const input = e => {
	commentElement.innerText = "// Press 'enter' to save in URL or\n" + "// click on the dots for more info";

	if (e.key === "Enter") {
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

		inputElement.focus();
		inputElement.setSelectionRange(0, inputElement.value.length);
		document.execCommand("copy");

		history.replaceState(null, inputElement.value, saveURL);
		return false;
	}

	setFunc();
};

if (window.location.search) {
	const url = new URLSearchParams(window.location.search);

	new Example(introString, url.get("c"), {
		mode: url.get("m"),
		circles: url.get("r"),
		scale: url.get("z"),
		speed: url.get("s")
	}).activate();
} else {
	nextExample();
}

inputElement.addEventListener("keyup", input);
inputElement.addEventListener("keydown", input);
canvasElement.addEventListener("click", nextExample);
