import socket from "../util_modules/websocket.js";
import("../components/graph-box/graph-box.js").then(() => {
    const sensorChart = document.getElementById("chart-sensor");



    // Register Charts with websocket
    socket.register(socket.schemas.TUNING, sensorChart, (event) => {
        sensorChart.pushDataPoint(event.detail.timestamp, [event.detail.error,event.detail.setPoint]);
    });

});

import("../components/tuning-box/tuning-box.js").then(() => {
    const sensorReadout = document.getElementById("sensor-readout");
    document.querySelectorAll("tuning-box").forEach((box) => {
        if (box.id.localeCompare("sensor-readout") != 0) {
            socket.register(socket.schemas.TUNING, box, (event) => {
                if (!box._focussed) {
                    box.value = event.detail[box.selectedDataKey];
                }
            })
            box.output = (key, value) => {
                socket.sendText(key + ":" + value);
            }
        }
    });
    socket.register(socket.schemas.STATE, sensorReadout, (event) => {
        if (!sensorReadout._focussed) {
            sensorReadout.value = event.detail[sensorReadout.selectedDataKey];
        }
        sensorReadout.output = (key, value) => {
            socket.sendText(key + ":" + value);
        }
    })
});