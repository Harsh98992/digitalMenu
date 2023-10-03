import { environment } from "src/environments/environment";
import { io } from "socket.io-client";

export class SocketService {

    socket: any;
    socketApiUrl = environment.socketApiUrl;

    constructor() {
        this.socket = io(this.socketApiUrl);
    }

    getSocket() {
        return this.socket;
    }

    emitEvent(eventName: string, data: any) {
        this.socket.emit(eventName, data);
    }

    listenEvent(eventName: string) {

        return new Promise((resolve, reject) => {
            this.socket.on(eventName, (data: any) => {
                resolve(data);
            });
        });
    }

    listenEventOnce(eventName: string) {

            return new Promise((resolve, reject) => {
                this.socket.once(eventName, (data: any) => {
                    resolve(data);
                });
            });
        }

    removeListener(eventName: string) {
        this.socket.off(eventName);
    }

    removeAllListeners() {
        this.socket.removeAllListeners();
    }

    disconnect() {
        this.socket.disconnect();
    }

    connect() {
        this.socket.connect();
    }

    close() {
        this.socket.close();
    }

    onConnect() {
        this.socket.on("connect", () => {
            console.log("connected");
        });
    }

    onDisconnect() {
        this.socket.on("disconnect", () => {
            console.log("disconnected");
        });
    }


}
