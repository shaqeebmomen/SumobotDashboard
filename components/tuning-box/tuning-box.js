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
                this._input = this._root.querySelector("#text");
                this._set = this._root.querySelector("#set");
                this._reset = this._root.querySelector("#reset");
                this._defaultVal = 0.0;
                this.value = this._defaultVal;

                // Event Listeners

                this._set.addEventListener("click", (event) => {
                    if(this._output != null){
                        this.value = this.value; // Killing leading and trailing zeros
                        this._output(this.value);
                    }
                    else {
                        console.log("no output registered");
                    }
                });
                this._input.addEventListener("keyup", (event) => {
                    if(event.code == "Enter"){
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
                    })
            });// Fetch end
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }

    set label(value) {
        this._label.innerHTML = value;
    }

    get label() {
        return this._label.innerHTML;
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