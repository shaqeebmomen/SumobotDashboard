
export class NoFaceSocket extends EventTarget {



    constructor(user, pass, ipAddy = '192.168.1.1') {
        if (!NoFaceSocket.instance) {
            super();
            this.user = user;
            this.pass = pass;
            this.ipAddy = ipAddy;
            this.socketURI = `ws://${user}:${password}@${ipAddy}:81/`;
            this.socket = new WebSocket(this.socketURI);
            this.schemas = {
                STATE: "state",
                TUNING: "tuning",
                LOG: "log"
            }

            /**
             * Data Scheme
             * STATE: [
             *  {
             *      id: id_of_element,
             *      eventName: name_of_event
             *  }
             * ]
             */
            this.registry = {
                [this.schemas.STATE]: [],
                [this.schemas.TUNING]: [],
                [this.schemas.LOG]: []
            }

            this.socket.onopen = (e) => {
                console.log('socket opened');
                this.status = WebSocket.OPEN;
                document.querySelector("status-light").dispatchEvent(new CustomEvent("statuschange", {
                    detail: true
                }));
            }

            this.socket.onclose = (e) => {
                if (e.wasClean) {
                    console.log('closed socket-gucci');
                }
                else {
                    console.log('closed socket-not gucci');
                }
                document.querySelector("status-light").dispatchEvent(new CustomEvent("statuschange", {
                    detail: false
                }));
            }

            this.socket.onerror = (e) => {
                console.log(`error: `);
                console.log(e);
            }

            this.socket.onmessage = (e) => {
                const parsedData = e.data.toString().split(":");
                const schema = parsedData[0];
                let data = parsedData[1].split(",");
                switch (schema) {
                    // Format: "encR,encL,velR,velL,angle,omega,mode,timestamp"
                    case this.schemas.STATE:
                        let state_data = {
                            encR: data[0],
                            encL: data[1],
                            velR: data[2],
                            velL: data[3],
                            angle: data[4],
                            omega: data[5],
                            mode: data[6],
                            timestamp: data[7]
                        };
                        this.registry[this.schemas.STATE].forEach(element => {
                            const target = document.getElementById(element.id);
                            target.dispatchEvent(new CustomEvent(element.eventName, {
                                detail: state_data
                            }));
                        });
                        break;
                    // Format: "kP, kI, kD, g_offset"
                    case this.schemas.TUNING:
                        let tuning_data = {
                            kP: data[0],
                            kI: data[1],
                            kD: data[2],
                            g_offset: data[3]
                        };

                        this.registry[this.schemas.TUNING].forEach(element => {
                            const target = document.getElementById(element.id);
                            target.dispatchEvent(new CustomEvent(element.eventName, {
                                detail: tuning_data
                            }));
                        });
                        break;

                    case this.schemas.LOG:
                        data = parsedData[1];
                        // this.logUpdate(data);
                        this.registry[this.schemas.LOG].forEach(element => {
                            const target = document.getElementById(element.id);
                            target.dispatchEvent(new CustomEvent(element.eventName, {
                                detail: data
                            }));
                        });
                        break;
                    // Misc data
                    default:
                        console.log(e.data);
                        break;
                }
            }

            // Event Listeners
            this.addEventListener("socketsend", (event) => {
                this.sendText(event.detail);
            })

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


    register(pageName, id, eventName) {
        //Check to remove duplicate (one element can register for multiple events)
        if (this.registry[pageName].some((element) => element.id == id && element.eventname == eventName)) {
            this.registry[pageName].splice(this.registry[pageName].findIndex((element) => {
                element.id == id;
            }), 1);
        }
        this.registry[pageName].push({ id, eventName });
    }


};

let user = 'Shabeeb';
let password = 'nomnom69';
// let ipAddy = 'nofacedash';
const nfSocket = new NoFaceSocket(user, password);
export default nfSocket;

