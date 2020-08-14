const template = document.createElement('template');


class DashLogger extends HTMLElement {
    constructor() {
        super();
        this.commands = [];
        this.commandIndex = 0;
        this.commandLengthMax = 10;
        this._scroll_en = true;
        fetch("/components/dash-logger/dash-logger.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
                this.logger = this.shadowRoot.querySelector("#logger");
                this.commandSender = this.shadowRoot.querySelector("#commandSender");
                this.scrollBtn = this.shadowRoot.querySelector("#scrollBtn");
                this.clearBtn = this.shadowRoot.querySelector("#clearBtn");
                this._maxLogs = 50;
                this._logs = [];


                // Event Listeners
                this.commandSender.addEventListener("keyup", (event) => {
                    if (event.code === "Enter") {
                        this.logOutputFun(this.commandSender.value);
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
                });
                this.clearBtn.addEventListener("click", (event) => {
                    this.logger.value = "";
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

    // Pass in a string message to log, timestamp prepended automatically
    pushLog(data) {
        let date = new Date();

        const newLog = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds() + "->" + data + "\n";

        if (this._logs.length >= this._maxLogs) {

            const currentVal = this.logger.value;
            this.logger.value = currentVal.slice(currentVal.indexOf(this._logs[0]));
            this._logs.shift();
        }
        this._logs.push(newLog);

        this.logger.value += newLog;

        if (this.scroll_en) {
            this.logger.scrollTop = this.logger.scrollHeight;
        }
    }

    set scroll_en(value) {
        this._scroll_en = value;
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
        return this._scroll_en;
    }


    set logOutputFun(value) {
        this._logOutputFun = value;
    }

    set maxLogs(value) {
        this._maxLogs = value;
        if (this._logs.length > value) {
            const start = this._logs.length - this._maxPoints - 1;
            const end = this._logs.length - 1;
            this._logs = this._logs.slice(start, end);
        }
    }

}

window.customElements.define("dash-logger", DashLogger);