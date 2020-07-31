
class NoFaceSocket extends EventTarget {
    schemas = {
        STATE: "state",
        TUNING: "tuning",
        LOG: "log"
    }
    constructor(user, pass, ipAddy = '192.168.1.1') {
        if (!NoFaceSocket.instance) {
            super();
            this.user = user;
            this.pass = pass;
            this.ipAddy = ipAddy;
            this.socketURI = `ws://${user}:${password}@${ipAddy}:81/`;
            this.socket = new WebSocket(this.socketURI);


            this.socket.onopen = (e) => {
                console.log('socket opened');
                this.status = WebSocket.OPEN;
            }

            this.socket.onclose = (e) => {
                if (e.wasClean) {
                    console.log('closed socket-gucci');
                }
                else {
                    console.log('closed socket-not gucci');
                }
            }

            this.socket.onerror = (e) => {
                console.log(`error: `);
                console.log(e);
            }

            this.socket.onmessage = (e) => {
                console.log(e.data);
                const parsedData = e.data.toString().split(":");
                const schema = parsedData[0];
                data = parsedData[1].split(",");
                switch (schema) {
                    case this.schemas.STATE:
                        // Format: "encR,encL,velR,velL,angle,omega,mode,timestamp"
                        // Encoders
                        if(encoderRChart = document.querySelector("chart-encR")){
                            encoderRChart.dispatchEvent(new CustomEvent("encRupdate"), {
                                encR: data[0],
                                velR: data[2]
                            });
                        }
                        if(encoderLChart = document.querySelector("chart-encL")){
                            encoderLChart.dispatchEvent(new CustomEvent("encLupdate"), {
                                encL: data[1],
                                velL: data[3]
                            });
                        }
                        // Gyro
                        if(gyroChart = document.querySelector("chart-gyro")){
                            gyroChart.dispatchEvent(new CustomEvent("gyroupdate"), {
                                angle: data[4],
                                omega: data[5]
                            });
                        }
                        // Mode
                        // if(gyroChart = document.querySelector("chart-gyro")){
                        //     gyroChart.dispatchEvent(new CustomEvent("gyroupdate"), {
                        //         angle: data[2],
                        //         omega: data[3]
                        //     });
                        // }
                        
                        break;

                    case this.schemas.TUNING:
                        break;

                    case this.schemas.LOG:
                        data = parsedData[1];
                        document.querySelector("#dash-logger").shadowRoot.querySelector("#logger").dispatchEvent(new CustomEvent("logupdate"), {
                            detail: data,
                            bubbles: true
                        });
                        break;

                    default:
                        this.update(e.data);
                }
            }
            NoFaceSocket.instance = this;
        }
        return this;
    }

    sendText(data) {
        if (this.status === WebSocket.OPEN) {
            this.socket.send(data.toString());
            console.log("Sent: " + data.toString());
        }
        else {
            console.log("WebSocket not connected, cant send data");
        }
    }

    update(data) {
        document.querySelector("#dash-logger").shadowRoot.querySelector("#logger").dispatchEvent(new CustomEvent("socketupdate", {
            detail: data,
            bubbles: true
        }));
    }


}

let user = 'Shabeeb';
let password = 'nomnom69';
// let ipAddy = 'nofacedash';
const nfSocket = new NoFaceSocket(user, password);
export default nfSocket;

