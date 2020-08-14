const template = document.createElement('template');


class StatusLight extends HTMLElement {
    constructor() {
        super();
        this._status = false;
        fetch("/components/status-light/status-light.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
                this.light = this.shadowRoot.querySelector("#status");

            }).then(() => {
                fetch("/components/status-light/status-light.css")
                    .then((response) => {
                        return response.text();
                    })
                    .then((data) => {
                        const link = document.createElement("style");
                        link.innerHTML = data;
                        this.shadowRoot.appendChild(link);
                        this.changeColors("green", "red");
                        this.status = this._status;
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

    changeColors(en, dis) {
        this.shadowRoot.removeChild(this.shadowRoot.querySelector("#state-styles"));
        let link = document.createElement("style");
        link.id = "state-styles"
        link.innerHTML = `
        .enabled {
            background-color: ${en}
        }
        
        .disabled {
            background-color: ${dis}
        }
        `;
        this.shadowRoot.appendChild(link);
    }

    // Pass in true or false to change styling to represent enabled or disabled respectively
    set status(value) {
        this._status = value;
        if (value) {
            this.light.classList.remove("disabled");
            this.light.classList.add("enabled");
        }
        else {
            this.light.classList.remove("enabled");
            this.light.classList.add("disabled");
        }
    }


}

window.customElements.define("status-light", StatusLight);