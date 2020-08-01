import nfSocket from '../util_modules/websocket.js'

const template = document.createElement('template');


class DashLogger extends HTMLElement {
    constructor() {
        super();
        this.commands = [];
        this.commandIndex = 0;
        this.commandLengthMax = 10;
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
                    if (event.code === "Enter") {
                        nfSocket.sendText(this.commandSender.value);
                        if (this.commands.length === this.commandLengthMax) {
                            this.commands.pop();
                        }

                        this.commands.unshift(this.commandSender.value);
                        this.commandSender.value = "";
                        this.commandIndex = -1;
                        console.log(this.commands);
                    }
                    if (event.code === "ArrowUp") {

                        if (this.commandIndex < this.commands.length - 1) {
                            this.commandIndex++;
                            this.commandSender.value = this.commands[this.commandIndex];
                        }


                    }
                    else if (event.code === "ArrowDown") {
                        if (this.commandIndex > 0) {
                            this.commandIndex--;
                            this.commandSender.value = this.commands[this.commandIndex];
                        }
                        else if(this.commandIndex == 0) {
                            this.commandIndex--;
                            this.commandSender.value = "";
                            
                        }

                    }
                    console.log(this.commandIndex);
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