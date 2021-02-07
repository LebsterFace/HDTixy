//#region Math
// I don't want to use with(Math)

const abs = Math.abs,
	acos = Math.acos,
	acosh = Math.acosh,
	asin = Math.asin,
	asinh = Math.asinh,
	atan = Math.atan,
	atan2 = Math.atan2,
	atanh = Math.atanh,
	cbrt = Math.cbrt,
	ceil = Math.ceil,
	clz32 = Math.clz32,
	cos = Math.cos,
	cosh = Math.cosh,
	exp = Math.exp,
	expm1 = Math.expm1,
	floor = Math.floor,
	fround = Math.fround,
	hypot = Math.hypot,
	imul = Math.imul,
	log = Math.log,
	log1p = Math.log1p,
	log2 = Math.log2,
	log10 = Math.log10,
	max = Math.max,
	min = Math.min,
	pow = Math.pow,
	random = Math.random,
	round = Math.round,
	sign = Math.sign,
	sin = Math.sin,
	sinh = Math.sinh,
	sqrt = Math.sqrt,
	tan = Math.tan,
	tanh = Math.tanh,
	trunc = Math.trunc,
	E = Math.E,
	LN2 = Math.LN2,
	LN10 = Math.LN10,
	LOG2E = Math.LOG2E,
	LOG10E = Math.LOG10E,
	PI = Math.PI,
	SQRT1_2 = Math.SQRT1_2,
	SQRT2 = Math.SQRT2;
//#endregion
//#region Setup
const canvasElement = document.getElementById("output"),
	inputElement = document.getElementById("code");

const useColors = document.getElementById("colors"),
	useEager = document.getElementById("eager"),
	useFPS = document.getElementById("fps"),
	useTIXY = document.getElementById("tixy"),
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

function logScale(x, minV, maxV, maxP) {
	const minv = log(minV),
		maxv = log(maxV),
		scale = (maxv - minv) / maxP;
	return exp(minv + scale * x);
}

useSpeed.oninput = _ => {
	speed = logScale(parseFloat(useSpeed.value), 0.1, 10, 1000);
	speed = round(speed * 100) / 100;
	speedDisplay.innerText = speed.toFixed(2).toString().padStart(5, " ");
};

useScale.oninput = _ => {
	scale = parseInt(useScale.value);
	scaleDisplay.innerText = useScale.value.padStart(2, " ");
};

function setFunc(event = {code: "Enter"}) {
	if (useEager.checked) {
		if (inputElement.value === rawInput) return;
	} else if (event.key !== "Enter") {
		return;
	}

	rawInput = inputElement.value;

	if (!useEager.checked) flashRed();

	try {
		userFunc = eval(`(t,i,x,y)=>{try{return ${rawInput};}catch(e){return null;}}`);
	} catch (e) {
		userFunc = () => 0;
	}

	time = 0;
}

inputElement.addEventListener("keyup", setFunc);
inputElement.addEventListener("keydown", setFunc);
setFunc();

function flashRed() {
	inputElement.classList.add("red");
	setTimeout(() => inputElement.classList.remove("red"), 75);
}

function rgb(r, g, b) {
	return r * 65536 + g * 256 + b;
}

function hsl(h, s, l) {
	l /= 100;
	const a = s * min(l, 1 - l) / 100;
	const f = n => {
		const k = (n + h / 30) % 12;
		const color = l - a * max(min(k - 3, 9 - k, 1), -1);
		return round(255 * color);
	};

	return rgb(f(0), f(8), f(4));
}

function avg(array) {
	let result = 0;
	for (let i = 0; i < array.length; i++) result += array[i];
	return result / array.length;
}

function getPixel(t, i, x, y) {
	try {
		return userFunc(t, i, x, y) || 0;
	} catch (e) {
		return 0; // null on error?
	}
}
//#endregion
//#region Render
const lastFrameTimes = [];

function render() {
	// Calculate the miliseconds since the last frame started being rendered
	const currentNow = performance.now(),
		milisecondDiff = currentNow - previousNow;
	previousNow = currentNow;

	//      miliseconds -> seconds               255x faster if not using tixyland
	time += milisecondDiff / 1000 * speed * (useTIXY.checked ? 1 : 255);

	ctx.clearRect(0, 0, width, height);
	let i = -1;

	for (let y = 0; y < height; y += scale) {
		for (let x = 0; x < width; x += scale) {
			i++;

			const rawValue = getPixel(time, i, x / scale, y / scale),
				pixelColor = abs(max(min(round(parseFloat(rawValue)), 4294967295), -4294967295));

			if (useTIXY.checked) {
				// tixy.land mode
				const tixyColor = max(-1, min(1, rawValue));
				if (useCircles.checked) {
					// Circles don't fade
					ctx.fillStyle = tixyColor < 0 ? `#F24` : `#FFF`;
					ctx.beginPath();
					ctx.arc(x + scale / 2, y + scale / 2, abs(tixyColor) * (scale / 2), 0, 2 * Math.PI);
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
	lastFrameTimes.push(milisecondDiff);

	if (useFPS.checked) {
		const fps = `${round(1000 / avg(lastFrameTimes))} FPS`;
		ctx.fillStyle = "white";
		ctx.strokeText(fps, 10, 10);
		ctx.fillText(fps, 10, 10);
	}
}
//#endregion

render();
