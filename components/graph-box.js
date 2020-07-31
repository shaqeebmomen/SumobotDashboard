const template = document.createElement('template');


class GraphBox extends HTMLElement {

    constructor() {
        super();
        fetch("./components/graph-box.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
                this.ctx = this.shadowRoot.querySelector("canvas");
                this.container = this.shadowRoot.querySelector(".container");

                this.rootStyles = getComputedStyle(document.documentElement);
                this.fontSize = this.rootStyles.getPropertyValue("font-size");
                this.fontFamily = this.rootStyles.getPropertyValue("font-family");
                this.fontColor = this.rootStyles.getPropertyValue("--color-secondary");
                this.tertiaryColor = this.rootStyles.getPropertyValue("--color-tertiary");

                Chart.defaults.global.defaultFontFamily = this.fontFamily;
                Chart.defaults.global.defaultFontColor = this.fontColor;
                Chart.defaults.global.defaultFontSize = parseInt(this.fontSize.substring(0, this.fontSize.length - 2), 10);

                //Adjust internal size
                this.ctx.width = this.container.width;
                this.ctx.height = this.container.height

                this._label = this.getAttribute("label")
                this._data = {
                    x: [0, 1, 2, 3, 4, 5, 6, 7],
                    y: [12, 19, 12, 34, 12, -50, -25, -10]
                }

                this.drawGraph();

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


    updateData = (x, y) => {
        this._data.x = x;
        this._data.y = y;
        this.chart.update();
    }


    drawGraph = () => {
        // Global Options


        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: this._data.x,
                datasets: [{
                    label: this._label,
                    data: this._data.y,
                    pointBackgroundColor: "rgba(255,255,255,1)",
                    pointRadius: "2",
                    backgroundColor: "rgba(0,0,0,0)",
                    borderColor: "rgba(255, 255, 255, 1)",
                    borderWidth: 2
                }]
            },
            options: {

                scales: {
                    xAxes: [{
                        gridLines: {
                            color: this.fontColor,
                            display: true,
                            zeroLineColor: this.fontColor
                        },
                        ticks: {
                            padding: 5
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: this.fontColor,
                            display: true,
                            zeroLineColor: this.tertiaryColor,
                            zeroLineWidth: 3
                        },
                        ticks: {
                            padding: 5,
                            
                        }
                    }]
                }
            }

        });
    }


    set label(value) {
        this._label = value;
        this.setAttribute("label", value);
        this.chart.update();
    }
}

window.customElements.define("graph-box", GraphBox);