class SocketEvent {
    constructor(app, { name, params, auth }) {
        this.app = app;
        this.name = name;
        this.params = params;
        this.auth = auth;
    }

    listen(socket) {
        socket.on(name, this.processEvent);
    }

    processEvent(data) {
        
    }
}

module.exports = SocketEvent;