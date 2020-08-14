import socket from "../util_modules/websocket.js";
import("../components/graph-box/graph-box.js").then(() => {
    const distChart = document.getElementById("chart-dist");
    const velChart = document.getElementById("chart-vel");


    // Register Charts with websocket
    socket.register(socket.schemas.STATE, distChart, (event) => {
        distChart.pushDataPoint(event.detail.timestamp, [event.detail.encR, event.detail.encL])
    });

    socket.register(socket.schemas.STATE, velChart, (event) => {
        velChart.pushDataPoint(event.detail.timestamp, [event.detail.velL, event.detail.velR])
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