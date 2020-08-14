
export class NoFaceSocket extends EventTarget {

    constructor(user, pass, ipAddy = "192.168.1.1", port = "81") {
        super();
        this.user = user;
        this.pass = pass;
        this.ipAddy = ipAddy;
        this.socketURI = `ws://${user}:${password}@${ipAddy}:${port}/`;
        this.socket = new WebSocket(this.socketURI);
        this.schemas = {
            STATE: "state",
            TUNING: "tuning",
            LOG: "log",
            SOCKET: "socket"
        }


        /**   Data Scheme
        registry = {
            STATE: [elementObjects...]
        }
        */

        this.registry = {
            [this.schemas.STATE]: [],
            [this.schemas.TUNING]: [],
            [this.schemas.LOG]: [],
            [this.schemas.SOCKET]: []
        }

        this.configSocket();

        // Event Listeners
        this.addEventListener("socketsend", (event) => {
            this.sendText(event.detail);
        })


    }

    configSocket() {
        this.socket.onopen = (e) => {
            console.log('socket opened');
            this.status = WebSocket.OPEN;
            this.fireUpdate(this.schemas.SOCKET, true);
        }

        this.socket.onclose = (e) => {
            if (e.wasClean) {
                console.log('closed socket-gucci');
            }
            else {
                console.log('closed socket-not gucci');
                this.reconnect();
            }
            this.fireUpdate(this.schemas.SOCKET, false);

        }

        this.socket.onerror = (e) => {
            console.log(`error: `);
            console.log(e);
        }

        this.socket.onmessage = (e) => {
            console.log(e.data.toString());
            const parsedData = e.data.toString().split(":");
            const schema = parsedData[0];
            let data = parsedData[1].split(",");
            switch (schema) {
                // Format: "encR,encL,encAvg,velR,velL,angle,omega,state,timestamp"
                case this.schemas.STATE:
                    let state_data = {
                        encR: data[0],
                        encL: data[1],
                        encAvg: data[2],
                        velR: data[3],
                        velL: data[4],
                        angle: data[5],
                        omega: data[6],
                        state: data[7],
                        timestamp: parseInt(data[8]) / 1000

                    };
                    
                    this.fireUpdate(this.schemas.STATE, state_data);
                    break;
                // Format: "kP,kI,kD,setpoint,g_offset"
                case this.schemas.TUNING:
                    let tuning_data = {
                        kF: data[0],
                        kP: data[1],
                        kI: data[2],
                        kD: data[3],
                        setPoint: data[4],
                        g_offset: data[5],
                        error: data[6],
                        timestamp: parseInt(data[7]) / 1000
                        
                    };
                    this.fireUpdate(this.schemas.TUNING, tuning_data);

                    break;

                case this.schemas.LOG:
                    this.fireUpdate(this.schemas.LOG, data[0]);
                    break;
                // Misc data
                default:
                    console.log(e.data);
                    break;
            }
        }
    }

    reconnect() {
        console.log("reconnecting to socket");
        setTimeout(() => {
            this.socket = new WebSocket(this.socketURI);
            this.configSocket();
        }, 1000);
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

    // Register a dom object for updates when specified page is updated
    register(pageName, element, callback) {
        // Check to remove duplicate 
        // See if duplicate exists
        if (this.registry[pageName].some((el) => el.id == element.id)) {
            // Splice duplicate out
            console.log("Replacing element from registry list: ");
            console.log(element);
            this.registry[pageName].splice(this.registry[pageName].findIndex((el) => {
                el.id == element.id;
            }), 1);
        }
        // Add event listener for websocket update
        element.addEventListener("ws: " + pageName, callback);
        // Add to registry
        this.registry[pageName].push(element);
    }

    // Fire updates for all elements registered for specified page update
    fireUpdate(pageName, data) {
        // console.log(data);
        // this.registry[pageName].forEach(element => {
        //     element.dispatchEvent(new CustomEvent("ws: " +  pageName, {
        //         detail: data
        //     }));
        // });
        for (let i = 0; i < this.registry[pageName].length; i++) {
            const element = this.registry[pageName][i];
            element.dispatchEvent(new CustomEvent("ws: " + pageName, {
                detail: data
            }));
        }
    }


};

let user = 'Shabeeb';
let password = 'nomnom69';
// let ipAddy = 'nofacedash';
const nfSocket = new NoFaceSocket(user, password);
export default nfSocket;

