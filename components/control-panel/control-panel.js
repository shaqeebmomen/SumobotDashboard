const template = document.createElement('template');


class ControlPanel extends HTMLElement {
    constructor() {
        super();
        fetch("/components/control-panel/control-panel.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
                this._stateDisplay = this.shadowRoot.querySelector("#state-display");
                this._disableBtn = this.shadowRoot.querySelector("#disable-btn");
                this._pauseBtn = this.shadowRoot.querySelector("#data-pause-btn");
                this._disableMethod = () => {
                    console.log("Disable Pressed");
                }
                this._pauseMethod = () => {
                    console.log("Pause Pressed");
                }
                this._states = this.getAttribute("states").split(",");
                this._activeState = this.getAttribute("active");
                this.updateStates();


                // Setup event listeners
                this._disableBtn.addEventListener("click", (event) => {
                    this._disableMethod();
                });
                this._pauseBtn.addEventListener("click",(event) => {
                    this._pauseMethod();
                })
            })
            .then(() => {
                fetch("/components/control-panel/control-panel.css")
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
        switch (name) {
            case "active":
                if (this._ready) {
                    this.setActiveState(newVal);
                }
                break;

            default:
                break;
        }
    }

    adoptedCallback() {
        //implementation
    }

    static get observedAttributes() {
        return ["active"];
    }

    updateStates() {
        this._stateDisplay.innerHTML = "";
        this._states.forEach(state => {
            const stateDiv = document.createElement("div");
            stateDiv.innerText = state;
            stateDiv.classList.add("stateDiv");
            if (state == this._activeState) {
                stateDiv.classList.add("activeStateDiv");
            }
            this._stateDisplay.appendChild(stateDiv);
        });
    }

    setActiveState(value) {
        this._activeState = value;
        this.updateStates();
    }

    set states(value) {
        this.setAttribute("states", value.join());
        this._states = value;
        this.updateStates();
    }

    set disableMethod(value) {
        this._disableMethod = value;
    }

    set pauseMethod(value) {
        this._pauseMethod = value;
    }

}

window.customElements.define("control-panel", ControlPanel);