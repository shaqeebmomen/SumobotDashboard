const template = document.createElement('template');


class DashLogger extends HTMLElement {
    constructor() {
        super();
        this.commands = [];
        this.commandIndex = 0;
        this.commandLengthMax = 10;
        this.scroll_enable = true;
        fetch("/components/dash-logger/dash-logger.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
                this.logger = this.shadowRoot.querySelector('#logger');
                this.commandSender = this.shadowRoot.querySelector('#commandSender');
                this.scrollBtn = this.shadowRoot.querySelector('#scrollBtn');
                this.scroll_en = this.scroll_enable;

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
                        else if (this.commandIndex == 0) {
                            this.commandIndex--;
                            this.commandSender.value = "";

                        }
                    }
                });


                this.scrollBtn.addEventListener("click", (event) => {
                    this.scroll_en = !this.scroll_en;
                })
            })
            .then(() => {
                fetch("/components/dash-logger/dash-logger.css")
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
        this.commandSender.removeEventListener("keyup");
    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }

    set scroll_en(value) {
        this.scroll_enable = value;
        if (value) {
            this.scrollBtn.textContent = "Stop Auto Scroll";
            this.scrollBtn.classList.remove("scroll-dis");
            this.scrollBtn.classList.add("scroll-en");
        }
        else {
            this.scrollBtn.textContent = "Start Auto Scroll";
            this.scrollBtn.classList.add("scroll-en");
            this.scrollBtn.classList.add("scroll-dis");
        }
    }

    get scroll_en() {
        return this.scroll_enable;
    }

    registerSocket(socket, pagename, eventName, callback) {
        socket.register(pagename, this.id, eventName);
        this.addEventListener(eventName, callback);
    }

    get logbox() {
        return this.logger;
    }

}

window.customElements.define("dash-logger", DashLogger);