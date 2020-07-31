
class NoFaceSocket extends EventTarget {
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
                
                this.update(e.data);

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
const nfSocket = new NoFaceSocket(user,password);
export default nfSocket;

