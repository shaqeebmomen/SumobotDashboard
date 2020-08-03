const template = document.createElement("template");


class NavBar extends HTMLElement {
    constructor() {
        super();
        /**
         * Data Structure
         * _links = [
         *      {
         *          destination: "something.html",
         *          label: "string"
         *      }
         * ]
         */
        this._links = [];
        this._ready = false;
        fetch("/components/nav-bar/nav-bar.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
                this._listElem = this.shadowRoot.querySelector("ul");

            })
            .then(() => {
                this.refreshList();
                this.setSelected();

            }).then(() => {
                fetch("/components/nav-bar/nav-bar.css")
                    .then((response) => {
                        return response.text();
                    })
                    .then((data) => {
                        const link = document.createElement("style");
                        link.innerHTML = data;
                        this.shadowRoot.appendChild(link);
                    });

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

    refreshList() {
        this._listElem.innerHTML = "";
        let index = 0;
        this._links.forEach(link => {
            let item = document.createElement("LI");
            item.setAttribute("index", `${index}`);
            item.innerHTML = `
            <a href="${link.destination}"><p>${link.label}</p></a>
            `;
            this._listElem.appendChild(item);
            index++;

        });


    }

    setSelected() {
        // console.log(this.shadowRoot.querySelectorAll("li"));
        this.shadowRoot.querySelectorAll("li").forEach(item => {
            item.querySelector("a").classList.remove(".selected");
            if (item.querySelector("p").textContent === this._selected) {
                item.querySelector("a").classList.add("selected");
            }
        });
    }

    set links(val) {
        this._links = val;
        if (this._ready) {
            this.refreshList();
        }
    }

    set selected(val) {
        this._selected = val;
        if (this._ready) {
            this.setSelected(val);
        }
    }
}

window.customElements.define('nav-bar', NavBar);