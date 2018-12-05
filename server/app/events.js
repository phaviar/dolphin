const auth = require("./auth.js");

module.exports = app => {
    const io = app.io;
    io.use(auth(app));
    io.on("connection", socket => {
        const event = name => socket.on(name, data => require("../events/" + name + ".js")(app)(socket, data));
        
        event("message_create");
        event("message_delete");
        event("connect");
    });
};