const template = document.createElement('template');


class GraphBox extends HTMLElement {

    /*
        This object is meant to be created by
        using the label attribute formatted as -> "label1,label2,...label99" to establish the data sets
        and then calling the updateData(x,y[{}]) method to properly populate the data (schema below)

        Mind that some css properties need to be defined to make this work properly, see below comment "Importing CSS properties"
    */
    constructor() {
        super();
        fetch("/components/graph-box/graph-box.html")
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                template.innerHTML = data;
                this.attachShadow({ mode: "open" });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
                this.ctx = this.shadowRoot.querySelector("canvas");
                this.container = this.shadowRoot.querySelector(".container");
                this.maxPointCount = 500;

                // Importing CSS properties
                this.rootStyles = getComputedStyle(this);
                this.fontSize = this.rootStyles.getPropertyValue("font-size");
                this.fontFamily = this.rootStyles.getPropertyValue("font-family");
                this.fontColor = this.rootStyles.getPropertyValue("--color-secondary");

                Chart.defaults.global.defaultFontFamily = this.fontFamily;
                Chart.defaults.global.defaultFontColor = this.fontColor;
                Chart.defaults.global.defaultFontSize = parseInt(this.fontSize.substring(0, this.fontSize.length - 2), 10);
                Chart.defaults.global.elements.point.pointBackgroundColor = "rgba(255,255,255,1)";
                Chart.defaults.global.elements.point.pointRadius = "2";
                Chart.defaults.global.elements.line.backgroundColor = "rgba(0,0,0,0)";
                Chart.defaults.global.elements.line.borderWidth = 2;

                //Adjust internal size
                this.ctx.width = this.container.width;
                this.ctx.height = this.container.height
                this._labels = this.getAttribute("label").split(",");
            })
            .then(() => {
                fetch("/components/graph-box/graph-box.css")
                    .then((response) => {
                        return response.text();
                    })
                    .then((data) => {
                        const link = document.createElement("style");
                        link.innerHTML = data;
                        this.shadowRoot.appendChild(link);
                    })
                    .then(() => {
                        this.initGraph();
                        this.updateData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                            [
                                {
                                    y: [12, 32, 41, 2, -5, -20, 9, -10, 5, 2],
                                    color: "blue"
                                },
                                {
                                    y: [2, 5, -10, 9, -20, -5, 2, 41, 32, 12],
                                    color: "red"
                                }
                            ]
                        )
                    })
            });// Fetch end;
    }

    connectedCallback() {
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === "label") {
            this._labels = newVal.split(",");
            if (this.chart) {
                for (let i = 0; i < this._labels.length; i++) {
                    this.chart.data.datasets[i].label = this._labels[i];
                }
                this.chart.update();
            }
        }

    }

    static get observedAttributes() {
        return ["label"];
    }

    adoptedCallback() {
        //implementation
    }

    // Add point onto the dataset 
    pushDataPoint(x, y) {
        const maxed = this.chart.data.labels.length >= this.maxPointCount
        this.chart.data.labels.push(x);
        if (maxed) {
            this.chart.data.labels.shift();
            for (let i = 0; i < y.length; i++) {
                this.chart.data.datasets[i].data.push(y[i]);
                this.chart.data.datasets[i].data.shift();
            }
        }
        else {
            for (let i = 0; i < y.length; i++) {
                this.chart.data.datasets[i].data.push(y[i]);
            }
        }

        this.chart.update();
    }

    // Full replace of data for chart, if data set is big.. trim it with maxPoints setter
    //Data Schema
    // {
    //     x: [0, 1, 2, 3, 4, 5, 6, 7],
    //     y: [
    //         {
    //             y: [12, 19, 12, 34, 12, -50, -25, -10],
    //             label: this._labels[0],
    //             color: "red"
    //         }
    //        ]
    // }
    updateData(x, y) {
        this.chart.data.labels = x;
        this.chart.data.datasets = [];
        for (let i = 0; i < this._labels.length; i++) {
            const dataset = y[i];
            const set = {
                label: this._labels[i],
                data: dataset.y,
                pointBackgroundColor: dataset.color,
                borderColor: dataset.color
            }
            this.chart.data.datasets.push(set);
        }
        this.chart.update();
    }

    // Only to load a new set of datasets, no modifying x labels
    updateSet(y) {
        for (let i = 0; i < this.chart.data.datasets.length; i++) {
            if (this.chart.data.datasets[i].label.localeCompare(y.label) === 0) {
                this.chart.data.datasets[i] = {
                    label: y.label,
                    data: y.y,
                    pointBackgroundColor: y.color,
                    borderColor: y.color
                }
                this.chart.update();
                return;
            }
        }
    }

    initGraph() {
        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
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
                            zeroLineWidth: 5
                        },
                        ticks: {
                            padding: 5,

                        }
                    }]
                }
            }
        });
    }

    //Pass in array of values
    set label(value) {
        this._labels = value;
        this.setAttribute("label", value.join(","));
        for (let i = 0; i < this._labels.length; i++) {
            this.chart.data.datasets[i].label = this._labels[i];
        }
        this.chart.update();
    }

    //Set the maximum amount of points for a graph
    set maxPoints(value) {
        this.maxPointCount = value;
        this.chart.data.labels = this.chart.data.labels.slice(this.chart.data.labels.length - this.maxPointCount - 1, this.chart.data.labels.length - 1)
        this.chart.update();
    }

    set yZeroLineColor(value) {
        this.chart.options.scales.yAxes.forEach(yAxis => {
            yAxis.gridLines.zeroLineColor = value;
        });
        this.chart.update();
    }
}

window.customElements.define("graph-box", GraphBox);