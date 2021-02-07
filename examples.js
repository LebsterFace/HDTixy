const tutorialElement = document.getElementById("comment");

class Example {
    constructor(description, code) {
        this.description = "// " + description.replace(/\n/g, "\n// ");
        this.code = code;

        if (!this.description.includes("\n")) this.description = "\n" + this.description;
    }

    activate() {
        tutorialElement.innerText = this.description;
        inputElement.value = this.code;
        setFunc();
    }
}

const examples = [
    new Example("hdtixy - tixy.land with more\nclick the dots for more info", "cos(t + i + x * y)")
];