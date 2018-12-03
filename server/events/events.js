const auth = require("./auth.js");

module.exports = app => {
    const io = app.io;
    io.use(auth(app));
    io.on("connection", socket => {
        const event = name => socket.on(name, require("./" + name + ".js")(app));
        
        event("message_create");
        event("message_delete");
    });
};