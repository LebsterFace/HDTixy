const tutorialElement = document.getElementById("comment");

class Example {
    constructor(description, code, custom = null) {

        // I really want both lines to align - it looks so nice!
        if (description.includes("\n")) {
            const [line1, line2] = description.split("\n");
            this.description = "// " + line1.padEnd(line2.length, " ") +
                             "\n// " + line2.padEnd(line1.length, " ");
        } else {
            this.description = "\n// " + description;
        }

        this.code = code;
        this.custom = custom;
    }

    activate() {
        tutorialElement.innerText = this.description;
        inputElement.value = this.code;
        setFunc({force: true});
        if (this.custom) this.custom();
    }
}

const examples = [
    new Example("HD Tixy - tixy.land with extras\nclick on the dots for more info", "cos(t + i + x * y)"),
    new Example("write a single javascript function\nto describe the state of every dot", "x > y"),
    new Example("return a decimal to change\nthe size of every dot", "x / 16"),
    new Example("parameter `t` is the time\nsince your code started", "sin(t)"),
    new Example("parameter `i` is the index\nof the dot", "i / 255"),
    new Example("positive numbers are white,\nnegatives are red", "y - t"),
    new Example("use the time to\nanimate the dots", "x-y*(cos(t)+1)"),
    new Example("and use the speed slider\nto change the speed", "y - t", () => {useSpeed.value = 1000;useSpeed.oninput();}),
    new Example("return a hexadecimal color\nwhen in color mode", "0x4034EB", () => {useColors.checked = true;}),
    new Example("or use the rgb function", "rgb(x*16, y*16, 0)"),
    new Example("the hsl function can be\nused for smooth transitions", "hsl(t, 100, 50)", () => {useSpeed.value = 125;useSpeed.oninput();}),
    new Example("disable circles for\nan alternative look", "[0xFF0000, 0, 0x0000FF][i%3]", () => {useCircles.checked = false;}),
    new Example("use the scale slider\nto zoom in or out", "x * y + t", () => {useScale.value = 8;useScale.oninput();}),
    new Example("you can omit 'Math.' when\nyou're using math functions", "hsl(6*(y-sin((x + t)/4)), 100, 50)"),
];