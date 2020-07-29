import {nfSocket} from '../util_modules/websocket.js'

const template = document.createElement('template');
template.innerHTML = `
    <style>
    :host{
        display:flex;
        flex-direction: column;
        padding: 2px;
        border: 2px var(--colour-primary-dark) solid;
    }

    textarea,input,p {
        resize: none;
        font-family: Roboto, sans-serif;
        font-size: 16px;
    }
    textarea::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
    }

    textarea::-webkit-scrollbar {
        width: 12px;
        background-color: #F5F5F5;
    }

    textarea::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #555;
    }

    p {
        padding:0;
        margin: 0;
    }

    </style>
        <span>
            <p>Console</p>
        </span>
        <textarea id="logger" draggable="false" readonly rows="6"></textarea>
        <input id="commandSender" type="text"></input>

`;


class DashLogger extends HTMLElement {
    constructor() {
        super();
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

        this.logger.addEventListener("socketupdate", (event)=>{
            let date = new Date();
            this.logger.value += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds() + "-> " + event.detail.toString();
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