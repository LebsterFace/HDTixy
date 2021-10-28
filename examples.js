const commentElement = document.getElementById("comment"),
	introString = "HD Tixy - tixy.land with extras\nclick on the dots for more info";

class Example {
	constructor(description, code, options = {}) {
		// I really want both lines to align - it looks so nice!
		if (description.includes("\n")) {
			const [line1, line2] = description.split("\n");
			this.description = "// " + line1.padEnd(line2.length, " ") + "\n// " + line2.padEnd(line1.length, " ");
		} else {
			this.description = "\n// " + description;
		}

		this.code = code;

		this.mode = options.mode || null;
		this.circles = options.circles || null;
		this.scale = options.scale || null;
		this.speed = options.speed || null;
	}

	activate() {
		if (this.mode !== null) {
			// String because of URL parameters
			if (this.mode === "2") {
				useTIXY.checked = true;
			} else if (this.mode === "1") {
				useColors.checked = true;
			} else {
				useGrey.checked = true;
			}
		}

		if (this.scale !== null) {
			useScale.value = this.scale;
			setScale();
		}

		if (this.speed !== null) {
			useSpeed.value = this.speed;
			setSpeed();
		}

        if (this.circles !== null) {
            useCircles.checked = this.circles === "1";
        }

		commentElement.innerText = this.description;
		inputElement.value = this.code;
		setFunc({force: true});
	}
}

const examples = [
	new Example(introString, "cos(t + i + x * y)", {mode: "2", scale: 32, speed: 500, circles: "1"}),
	new Example("write a single javascript function\nto describe the state of every dot", "x > y"),
	new Example("return a decimal to change\nthe size of every dot", "x / 16"),
	new Example("parameter `t` is the time\nsince your code started", "sin(t)"),
	new Example("parameter `i` is the index\nof the dot", "i / 255"),
	new Example("positive numbers are white,\nnegatives are red", "x - 8"),
	new Example("use the time to\nanimate the dots", "y - t"),
	new Example("and use the speed slider\nto change the speed", "y - t", {speed: 1000}),
	new Example("or multiply `t` to go even faster", "i - t * 10", {speed: 1000}),
	new Example("return a hexadecimal color\nwhen in color mode", "0x4034EB", {mode: "1"}),
	new Example("or use the rgb function", "rgb(x*16, y*16, 0)"),
	new Example("the hsl function can be\nused for smooth transitions", "hsl(t * 8, 100, 50)", {speed: 1000}),
	new Example("disable circles for\nan alternative look", "[0xFF0000, 0, 0x0000FF][i%3]", {circles: "0"}),
	new Example("use the scale slider\nto zoom in or out", "x * y + t*50", {scale: 8}),
	new Example("you can omit 'Math.' when\nyou're using math functions", "hsl(6*(y-sin((x + t * 7)/4)), 100, 50)"),
    new Example("Have Fun!", "", {mode: "2", scale: 32, speed: 500, circles: "1"})
];