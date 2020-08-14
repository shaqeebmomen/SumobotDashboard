import socket from "../util_modules/websocket.js";
import("../components/graph-box/graph-box.js").then(() => {
    const gyroChart = document.getElementById("chart-gyro");
    const encChart = document.getElementById("chart-enc");
    

    // Register Charts with websocket
    socket.register(socket.schemas.STATE, gyroChart, (event) => {
        gyroChart.pushDataPoint(event.detail.timestamp, [event.detail.angle])
    });
    socket.register(socket.schemas.STATE, encChart, (event) => {
        encChart.pushDataPoint(event.detail.timestamp, [event.detail.encAvg])
    });


});

import("../components/tuning-box/tuning-box.js").then(() => {
    document.querySelectorAll("tuning-box").forEach((box) => {
        socket.register(socket.schemas.STATE, box, (event) => {
            if (!box._focussed) {
                box.value = event.detail[box.selectedDataKey];
            }
        })
        box.output = (key, value) => {
            socket.sendText(key + ":" + value);
        }
    });
});