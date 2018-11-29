const auth = require("./auth.js");
const app = require("./app.js");
const io = app.io;

function connection (socket) {
    socket.on("message", data => {
        io.sockets.emit("message", data);
    });
}

module.exports = connection;
