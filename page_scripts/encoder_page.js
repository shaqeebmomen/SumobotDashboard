import socket from "../util_modules/websocket.js";
// Before window loads
import("../components/nav-bar/nav-bar.js").then(() => {
    const navbar = document.querySelector("nav-bar");
    navbar.links = [
        {
            destination: "../pages/index.html",
            label: "main"
        },
        {
            destination: "../pages/gyro.html",
            label: "gyro"
        },
        {
            destination: "../pages/encoder.html",
            label: "encoder"
        },
        {
            destination: "../pages/tuning.html",
            label: "tuning"
        }
    ];
    navbar.selected = "encoder";
});

import("../components/dash-logger/dash-logger.js").then(() => {
    const logger = document.querySelector("dash-logger");
    logger.registerSocket(socket, socket.schemas.LOG, "logupdate", (event) => {
        let date = new Date();
        logger.logbox.value += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds() + "->" + event.detail.toString() + "\n";
        if (logger.scroll_enable) {
            logger.logbox.scrollTop = logger.logbox.scrollHeight;
        }
    });
});



// After elements are loaded
window.onload = function () {
    import("../components/status-light/status-light.js").then(() => {
        const statuslight = document.querySelector("status-light");
        statuslight.status = socket.status == WebSocket.OPEN ? true : false;
    });
    import("../components/graph-box/graph-box.js").then(() => {
        document.querySelectorAll("graph-box").forEach(box => {
            box.initGraph();
        });
    });
}