class SocketManager {
    constructor() {
        this.sockets = {};
    }

    add(id, socket) {
        this.sockets[id] = socket;
    }
}

module.exports = SocketManager;