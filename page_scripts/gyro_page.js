import socket from "../util_modules/websocket.js";
import("../components/graph-box/graph-box.js").then(() => {
    const angleChart = document.getElementById("chart-angle");
    const omegaChart = document.getElementById("chart-omega");

    // Register Charts with websocket
    socket.register(socket.schemas.STATE, angleChart, (event) => {
        angleChart.pushDataPoint(event.detail.timestamp, [event.detail.angle])
    });
    socket.register(socket.schemas.STATE, omegaChart, (event) => {
        omegaChart.pushDataPoint(event.detail.timestamp, [event.detail.omega])
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