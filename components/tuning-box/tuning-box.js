const template = document.createElement("template");


class TuningBox extends HTMLElement {
    constructor() {
        super();

        fetch("/components/tuning-box/tuning-box.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this._root = this.attachShadow({ mode: "open" });
                this._root.appendChild(template.content.cloneNode(true));
                this._label = this._root.querySelector("#label");
                this._options = [this.getAttribute("label")];
                this._input = this._root.querySelector("#text");
                this._set = this._root.querySelector("#set");
                this._reset = this._root.querySelector("#reset");
                this._defaultVal = 0.0;
                this.value = this._defaultVal;

                // Event Listeners

                this._set.addEventListener("click", (event) => {
                    if (this._output != null) {
                        this.value = this.value; // Killing leading and trailing zeros
                        this._output(this.value);
                    }
                    else {
                        console.log("no output registered");
                        console.log(this.value);
                    }
                });
                this._input.addEventListener("keyup", (event) => {
                    if (event.code == "Enter") {
                        this._set.click();
                    }
                });

                this._reset.addEventListener("click", (event) => {
                    this.value = this._defaultVal;
                });
            })
            .then(() => {
                fetch("/components/tuning-box/tuning-box.css")
                    .then((response) => {
                        return response.text();
                    })
                    .then((data) => {
                        const link = document.createElement("style");
                        link.innerHTML = data;
                        this.shadowRoot.appendChild(link);
                    }).then(() => {
                        this.init();
                    })
            });// Fetch end
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (this._root) {
            switch (name) {
                case "label":
                    this.label = newVal;
                    break;

                case "options":
                    this._options = newVal.split(",");
                    if (this._options.length > 0) {
                        this.enableSelection();
                    }
            }
        }
    }

    static get observedAttributes() {
        return ["label", "options"];
    }

    adoptedCallback() {
        //implementation
    }

    enableSelection() {
        if (this._options) {
            this._selection = document.createElement("select");
            this._options.forEach(option => {
                const newOption = document.createElement("option");
                newOption.textContent = option;
                this._selection.appendChild(newOption);
            });
            this._root.querySelector(".col1").insertBefore(this._selection, this._input);
            if (this._label) {
                this._root.querySelector(".col1").removeChild(this._label);
            }
            this._selection.addEventListener("change", this.output ? this.output(this._selection.value) : () => { console.log(this._selection.value) });
            this._selection.dispatchEvent(new Event("change"));
        }
    }


    disableSelection() {
        if (this._label) {
            this._root.querySelector(".col1").removeChild(this._label);
        }
        this._label = document.createElement("H2");
        this.setAttribute("label", this._options[0]);
        this._root.querySelector(".col1").insertBefore(this._label, this._input);

        if (this._selection) {
            this._root.querySelector(".col1").removeChild(this._selection);
        }
    }

    init() {
        if (this.hasAttribute("options")) {
            this._options = this.getAttribute("options").split(",");
            this.enableSelection();
        }
        else if (this.hasAttribute("label")) {
            this.disableSelection();
        }
    }


    set label(value) {
        if (this._label) {
            this._label.innerHTML = value;
        }

    }

    get label() {
        return this._label.innerHTML;
    }

    set options(value) {
        this.setAttribute("options", value);
    }

    set value(value) {
        this._input.value = parseFloat(value);
    }

    get value() {
        return parseFloat(this._input.value);
    }

    set defaultVal(value) {
        this._defaultVal = value;
    }

    get defaultVal() {
        return this._defaultVal;
    }

    set output(fun) {
        this._output = fun;
    }

}

window.customElements.define("tuning-box", TuningBox);