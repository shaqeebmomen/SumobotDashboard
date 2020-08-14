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
});

import("../components/dash-logger/dash-logger.js").then(() => {
    const logger = document.querySelector("dash-logger");

    logger.logOutputFun = (data) => {
        console.log("sending: " + data);
        socket.sendText("Log:" + data);
    }

    socket.register(socket.schemas.LOG, logger, (event) => {
        logger.pushLog(event.detail.toString());
    });

});




window.onload = function () {
    import("../components/status-light/status-light.js").then(() => {
        const statuslight = document.querySelector("status-light");
        statuslight.status = socket.status == WebSocket.OPEN ? true : false;
        socket.register(socket.schemas.SOCKET, statuslight, (event) => {
            statuslight.status = event.detail;
        });
    });
    
    import("../components/graph-box/graph-box.js").then(() => {
        document.querySelectorAll("graph-box").forEach(box => {
            box.initGraph();
        });
    });

    import("../components/control-panel/control-panel.js").then(() => {
        const controlPanel = document.querySelector("control-panel");
        // Register State Display with websocket
        socket.register(socket.schemas.STATE, controlPanel, (event) => {
            controlPanel.setActiveState(event.detail.state);
        });

        controlPanel.disableMethod = () => {
            socket.sendText("!!!");
        };
        controlPanel.pauseMethod = () => {
            socket.sendText("---");
            document.querySelectorAll("graph-box").forEach((box) => {
                box.updating = !box.updating;
            })
        }
    });

}