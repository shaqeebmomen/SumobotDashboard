
const template = document.createElement('template');


class NavBar extends HTMLElement {
    constructor() {
        super();
        fetch("./components/nav-bar.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
            
            });

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

}

window.customElements.define('nav-bar', NavBar);