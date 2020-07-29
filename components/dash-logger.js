import { nfSocket } from '../util_modules/websocket.js'

const template = document.createElement('template');


class DashLogger extends HTMLElement {
    constructor() {
        super();
        fetch("./components/dash-logger.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
                this.logger = this.shadowRoot.querySelector('#logger');
                this.commandSender = this.shadowRoot.querySelector('#commandSender');

                // Event Listeners

                this.commandSender.addEventListener("keyup", (event) => {
                    if (event.code === 'Enter') {
                        nfSocket.sendText(this.commandSender.value);
                        this.commandSender.value = "";
                    }

                });

                this.logger.addEventListener("socketupdate", (event) => {
                    let date = new Date();
                    this.logger.value += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds() + "-> " + event.detail.toString();
                });
            });

    }

    connectedCallback() {

    }

    disconnectedCallback() {
        this.commandSender.removeEventListener("keyup");
    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }

}

window.customElements.define('dash-logger', DashLogger);