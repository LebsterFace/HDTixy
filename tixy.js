//#region Setup
const canvasElement = document.getElementById("output"),
	inputElement = document.getElementById("code");

const useColors = document.getElementById("colors"),
	useGrey = document.getElementById("grey"),
	useTIXY = document.getElementById("tixy"),
	useFPS = document.getElementById("fps"),
	useSpeed = document.getElementById("speed"),
	useScale = document.getElementById("scale"),
	useCircles = document.getElementById("circles");

const scaleDisplay = document.getElementById("currentScale"),
	speedDisplay = document.getElementById("currentSpeed");

const ctx = canvasElement.getContext("2d"),
	{width, height} = canvasElement;

let speed = 1,
	scale = 32,
	userFunc,
	rawInput,
	time = 0,
	previousNow = performance.now();

ctx.font = "16px monospace";
ctx.imageSmoothingEnabled = false;
ctx.strokeStyle = "black";
ctx.lineWidth = 2;
ctx.textBaseline = "top";

//#endregion
//#region Functions

const logScale = (x, minV, maxV, maxP) => {
	const minv = Math.log(minV),
		maxv = Math.log(maxV),
		scale = (maxv - minv) / maxP;
	return Math.exp(minv + scale * x);
};

useSpeed.addEventListener("input", _ => {
	speed = logScale(parseFloat(useSpeed.value), 0.1, 10, 1000);
	speed = Math.round(speed * 100) / 100;
	speedDisplay.innerText = speed.toFixed(2).toString().padStart(5, " ");
});

useScale.addEventListener("input", _ => {
	scale = parseInt(useScale.value);
	scaleDisplay.innerText = useScale.value.padStart(2, " ");
});

const MathDestructure = `const {${Object.getOwnPropertyNames(Math).join(",")}} = Math`;

const setFunc = (obj = {force: false}) => {
	if (!obj.force && inputElement.value === rawInput) return;
	rawInput = inputElement.value;

	try {
		userFunc = new Function("t", "i", "x", "y", `${MathDestructure};try{return ${rawInput};}catch (e){return null;}`);
	} catch (e) {
		userFunc = () => 0;
	}

	time = 0;
};

const rgb = (r, g, b) => (r << 16) | (g << 8) | b;

const hsl = (h, s, l) => {
	l /= 100;
	const a = s * Math.min(l, 1 - l) / 100;
	const f = n => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color);
	};

	return rgb(f(0), f(8), f(4));
};

const avg = array => {
	let result = 0;
	for (let i = 0; i < array.length; i++) result += array[i];
	return result / array.length;
};

const getPixel = (t, i, x, y) => {
	try {
		return userFunc(t, i, x, y) || 0;
	} catch (e) {
		return 0; // null on error?
	}
};

//#endregion
//#region Render
const lastFrameTimes = [];

const render = () => {
	// Calculate the milliseconds since the last frame started being rendered
	const currentNow = performance.now(),
		millisecondDiff = currentNow - previousNow;
	previousNow = currentNow;

	//      milliseconds -> seconds
	time += millisecondDiff / 1000 * speed;

	ctx.clearRect(0, 0, width, height);
	let i = -1;

	for (let y = 0; y < height; y += scale) {
		for (let x = 0; x < width; x += scale) {
			i++;

			const rawValue = getPixel(time, i, x / scale, y / scale),
				pixelColor = Math.abs(Math.max(Math.min(Math.round(parseFloat(rawValue)), 4294967295), -4294967295));

			if (useTIXY.checked) {
				// tixy.land mode
				const tixyColor = Math.max(-1, Math.min(1, rawValue));
				if (useCircles.checked) {
					// Circles don't fade
					ctx.fillStyle = tixyColor < 0 ? `#F24` : `#FFF`;
					ctx.beginPath();
					ctx.arc(x + scale / 2, y + scale / 2, Math.abs(tixyColor) * (scale / 2), 0, 2 * Math.PI);
					ctx.fill();
					continue;
				}

				ctx.fillStyle = tixyColor < 0 ? `hsla(351deg 100% 57% / ${-tixyColor})` : `rgb(${tixyColor * 255}, ${tixyColor * 255}, ${tixyColor * 255})`;
			} else if (useColors.checked) {
				// Color mode
				ctx.fillStyle = "#" + pixelColor.toString(16).padStart(6, "0");
			} else {
				// Black and white
				ctx.fillStyle = `rgb(${pixelColor % 256}, ${pixelColor % 256}, ${pixelColor % 256})`;
			}

			if (useCircles.checked) {
				ctx.beginPath();
				ctx.arc(x + scale / 2, y + scale / 2, scale / 2, 0, 2 * Math.PI);
				ctx.fill();
			} else {
				ctx.fillRect(x, y, scale, scale);
			}
		}
	}

	requestAnimationFrame(render);

	if (lastFrameTimes.length === 15) lastFrameTimes.shift();
	lastFrameTimes.push(millisecondDiff);

	if (useFPS.checked) {
		const fps = `${Math.round(1000 / avg(lastFrameTimes))} FPS`;
		ctx.fillStyle = "white";
		ctx.strokeText(fps, 10, 10);
		ctx.fillText(fps, 10, 10);
	}
};

//#endregion

render();
