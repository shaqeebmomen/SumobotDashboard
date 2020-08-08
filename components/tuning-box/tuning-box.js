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
                // Event Listeners
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

}

window.customElements.define("tuning-box", TuningBox);