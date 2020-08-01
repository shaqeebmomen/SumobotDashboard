const template = document.createElement('template');


class ControlPanel extends HTMLElement {
    constructor() {
        super();
        fetch("./components/control-panel.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
                this._stateDisplay = this.shadowRoot.querySelector("#state-display");
                this._states = this.getAttribute("states").split(",");
                this._activeState = this._states[0];
                this.updateStates();


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

    updateStates() {
        this._stateDisplay.innerHTML = "";
        this._states.forEach(state => {
            const stateDiv = document.createElement("div");
            stateDiv.innerText = state;
            stateDiv.classList.add("stateDiv");
            if(state == this._activeState){
                stateDiv.classList.add("activeStateDiv");
            }
            this._stateDisplay.appendChild(stateDiv);
        });
    }

    set states(value) {
        this.setAttribute("states", value.join());
        this._states = value;
        this.updateStates();
    }

    setActiveState(value) {
        this._activeState = value;
        this.updateStates();
    }

}

window.customElements.define("control-panel", ControlPanel);