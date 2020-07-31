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
                console.log(this.container);
                this.ctx.width = this.container.clientWidth;
                this.ctx.height = this.container.clientHeight;
                // Global Options
                const rootStyles = getComputedStyle(document.documentElement);
                const fontSize = rootStyles.getPropertyValue("font-size");
                const fontFamily = rootStyles.getPropertyValue("font-family");
                const fontColor = rootStyles.getPropertyValue("--color-secondary");
                const tertiaryColor = rootStyles.getPropertyValue("--color-tertiary");

                Chart.defaults.global.defaultFontFamily = fontFamily;
                Chart.defaults.global.defaultFontColor = fontColor;
                Chart.defaults.global.defaultFontSize = parseInt(fontSize.substring(0, fontSize.length - 2), 10);

                var myChart = new Chart(this.ctx, {
                    type: 'line',
                    data: {
                        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        datasets: [{
                            label: "Gyro Data",
                            data: [12, 19, 12, 34, 12, 54, 23, 23, 45, 64, 14, 34, 90, 23, 45, 0, -50, -25, -10],
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
                                    color: fontColor,
                                    display: true,
                                    zeroLineColor: fontColor

                                }
                            }],
                            yAxes: [{
                                gridLines: {
                                    color: fontColor,
                                    display: true,
                                    zeroLineColor: tertiaryColor,
                                    zeroLineWidth: 3
                                }
                            }]
                        }
                    }

                });



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

}

window.customElements.define("graph-box", GraphBox);