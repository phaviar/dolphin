const auth = require("./auth.js");
const app = require("./app.js");

function connection(socket) {
    socket.on("message", p => {

    });
}

module.exports = connection;