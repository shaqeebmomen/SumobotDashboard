const navbar = document.querySelector("nav-bar");
import("../components/nav-bar.js").then(() => {
    navbar.links = [
        {
            destination: "index.html",
            label: "main"
        },
        {
            destination: "gyro.html",
            label: "gyro"
        },
        {
            destination: "encoder.html",
            label: "encoder"
        },
        {
            destination: "tuning.html",
            label: "tuning"
        }
    ];
    navbar.selected = "main";
});

document.querySelectorAll(".chart-container").forEach(container => {
    let chart = container.querySelector("canvas");
    chart.width = container.clientWidth;
    chart.height = container.clientHeight;
});

// Global Options
const rootStyles = getComputedStyle(document.documentElement);
const fontSize = rootStyles.getPropertyValue("font-size");
const fontFamily = rootStyles.getPropertyValue("font-family");
const fontColor = rootStyles.getPropertyValue("--color-secondary");
const tertiaryColor = rootStyles.getPropertyValue("--color-tertiary");

Chart.defaults.global.defaultFontFamily = fontFamily;
Chart.defaults.global.defaultFontColor = fontColor;
Chart.defaults.global.defaultFontSize = parseInt(fontSize.substring(0, fontSize.length - 2), 10);



var ctx = document.getElementById('chart-gyro');
var myChart = new Chart(ctx, {
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

