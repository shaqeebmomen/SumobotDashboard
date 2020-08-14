const template = document.createElement('template');

// CDN import
// var chartJSImport = document.createElement('script');
// chartJSImport.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.js");
// chartJSImport.setAttribute("integrity", "sha512-QEiC894KVkN9Tsoi6+mKf8HaCLJvyA6QIRzY5KrfINXYuP9NxdIkRQhGq3BZi0J4I7V5SidGM3XUQ5wFiMDuWg==");
// chartJSImport.setAttribute("crossorigin", "anonymous");
// document.head.appendChild(chartJSImport);

// NPM import
// var chartJSImport = document.createElement("script");
// chartJSImport.setAttribute("src", "../../node_modules/chart.js/dist/Chart.js");
// document.head.appendChild(chartJSImport);

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
                this._maxPoints = 8;
                this._fixedScale = true;
                this._fixedScaleMax = 5000;
                this._updating = true;

                this.defaultColors = ["blue", "red", "yellow", "green"];

                // Importing CSS properties
                this.rootStyles = getComputedStyle(this);
                this.fontSize = this.rootStyles.getPropertyValue("font-size");
                this.fontFamily = this.rootStyles.getPropertyValue("font-family");
                this.fontColor = this.rootStyles.getPropertyValue("--color-secondary");

                Chart.defaults.global.animation.duration = 10;
                Chart.defaults.global.defaultFontFamily = this.fontFamily;
                Chart.defaults.global.defaultFontColor = this.fontColor;
                Chart.defaults.global.defaultFontSize = parseInt(this.fontSize.substring(0, this.fontSize.length - 2), 10);
                Chart.defaults.global.elements.point.pointBackgroundColor = "rgba(255,255,255,1)";
                Chart.defaults.global.elements.point.pointRadius = "2";
                Chart.defaults.global.elements.line.backgroundColor = "rgba(0,0,0,0)";
                Chart.defaults.global.elements.line.borderWidth = 2;

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

                        // this.updateData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        //     [
                        //         {
                        //             y: [12, 32, 41, 2, -5, -20, 9, -10, 5, 2],
                        //             color: "blue"
                        //         },
                        //         {
                        //             y: [2, 5, -10, 9, -20, -5, 2, 41, 32, 12],
                        //             color: "red"
                        //         }
                        //     ]
                        // )
                    })
            });// Fetch end;
    }

    connectedCallback() {
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name.localeCompare("label") === 0) {
            this._labels = newVal.split(",");
            if (this.chart) {
                for (let i = 0; i < this._labels.length; i++) {
                    this.chart.data.datasets[i].label = this._labels[i];
                }
                if (this.chart) {
                    this.chart.update();
                }

            }
        }

    }

    static get observedAttributes() {
        return ["label"];
    }

    adoptedCallback() {
        //implementation
    }

    // Add point onto the dataset, y is an array of values for each set
    pushDataPoint(x, y) {
        if (this._updating && y.length == this.chart.data.datasets.length) {
            const maxed = this.chart.data.labels.length >= this._maxPoints;
            if (!this.fixedScale) {
                this.chart.data.labels.push(x);
            }

            if (!this.fixedScale) {
                this.chart.data.labels.shift();
            }
            
            this.chart.data.datasets.forEach((set, index, sets) => {
                set.data.push(y[index]);
                set.data.shift();
            });

            this.chart.update();
        }
        else if (y.length != this.chart.data.datasets.length) {
            console.log("ERROR IN PASSED DATA ARRAY");
        }
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
    updateData(x, sets) {
        if (this._updating) {
            // Empty the sets
            this.chart.data.labels = x;
            this.chart.data.datasets = [];
            if (this._labels.length != sets.length) {
                console.log("Label & set counts dont match");
            }
            // Loop through each set
            for (let i = 0; i < this._labels.length; i++) {
                // Check if the set has no holes
                if (x.length != sets[i].y.length) {
                    // Reset the set if it does
                    this.chart.data.labels = [];
                    this.chart.data.datasets = [];
                    throw (new Error("number of x and y values dont match!!"));
                }
                const dataset = sets[i];
                const set = {
                    label: this._labels[i],
                    data: dataset.y,
                    pointBackgroundColor: dataset.color,
                    borderColor: dataset.color
                }
                this.chart.data.datasets.push(set);
            }
            if (x.length > this.maxPoints) {
                this.maxPoints = x.length;
            }

            this.chart.update();
        }

    }

    // Only to load a new set of datasets, no modifying x labels
    updateSet(y) {
        if (this.updating) {

            for (let i = 0; i < this.chart.data.datasets.length; i++) {
                if (this.chart.data.datasets[i].label.localeCompare(y.label) === 0) {
                    this.chart.data.datasets[i] = {
                        label: y.label,
                        data: y.y,
                        pointBackgroundColor: y.color,
                        borderColor: y.color
                    }
                    if (this.chart) {
                        this.chart.update();
                    }

                    return;
                }
            }
        }
    }

    initGraph() {
        //Adjust internal size
        this.ctx.width = this.container.width;
        this.ctx.height = this.container.height

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
                            padding: 5,
                            min: 3,
                            maxTicksLimit: 11

                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: this.fontColor,
                            display: true,
                            zeroLineWidth: 5,
                            zeroLineColor: this.fontColor
                        },
                        ticks: {
                            padding: 5,

                        }
                    }]
                },
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0, // animation duration after a resize
                elements: {
                    line: {
                        tension: 0
                    }
                }
            }
        });

        this._initSets = [];
        this._initX = [];
        // for (let i = 0; i < this.maxPoints; i++) {

        // }

        this._labels.forEach((label, index) => {
            this._initSets.push({
                y: [],
                label: label,
                color: this.defaultColors[index]
            });
        });

        for (let i = 0; i < this.maxPoints; i++) {
            this._initX.push(this.fixedScaleMax / this.maxPoints * i);
            this._initSets.forEach((set) => {
                set.y.push(0);
            });
        }

        this.updateData(this._initX, this._initSets);

    }

    //Pass in array of values
    set labels(value) {
        this._labels = value;
        this.setAttribute("label", value.join(","));
        for (let i = 0; i < this._labels.length; i++) {
            this.chart.data.datasets[i].label = this._labels[i];
        }
        this.chart.update();
    }

    //Set the maximum amount of points for a graph
    set maxPoints(value) {
        this._maxPoints = value;
        if (this.chart.data.labels.length > value) {
            const start = this.chart.data.labels.length - this._maxPoints - 1;
            const end = this.chart.data.labels.length - 1;
            this.chart.data.labels = this.chart.data.labels.slice(start, end);
            for (let i = 0; i < this.chart.data.datasets.length; i++) {
                this.chart.data.datasets[i].data = this.chart.data.datasets[i].data.slice(start, end);
            }
            this.chart.update();
        }
    }

    get maxPoints() {
        return this._maxPoints;

    }

    set yZeroLineColor(value) {
        this.chart.options.scales.yAxes.forEach(yAxis => {
            yAxis.gridLines.zeroLineColor = value;
        });
        this.chart.update();
    }

    set fixedScale(value) {
        this._fixedScale = value;
    }

    set updating(value) {
        this._updating = value;
    }

    get updating() {
        return this._updating;
    }

    set fixedScale(value) {
        this._fixedScale = value;
    }

    get fixedScale() {
        return this._fixedScale;
    }

    set fixedScaleMax(value) {
        this._fixedScaleMax = value;
    }

    get fixedScaleMax() {
        return this._fixedScaleMax;
    }
}

window.customElements.define("graph-box", GraphBox);